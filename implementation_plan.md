# Auth Frontend ↔ Backend Integration

Connect all 5 frontend auth forms to the NestJS backend at `http://localhost:4000/api/v1/auth/*`.

## Current State

- **Backend**: NestJS with 6 POST endpoints under `/api/v1/auth/`, JWT tokens (access + refresh), bcrypt, email verification via OTP
- **Frontend**: Next.js 16 with `react-hook-form` + `zod` — all forms are client components with **no submission logic** (just `console.log` or no `onSubmit`)
- **No API client** exists yet — no fetch wrapper, no token storage, no auth context
- **No CORS** enabled on the backend — calls from `localhost:3000` → `localhost:4000` will be blocked

## User Review Required

> [!IMPORTANT]
> **CORS**: The NestJS `main.ts` has no `app.enableCors()`. I will add it so the frontend can reach the backend. Alternatively, we could proxy via Next.js rewrites — but direct CORS is simpler for dev. Which do you prefer?

> [!IMPORTANT]
> **Token Storage**: Where should we store JWT tokens?
> - **Option A (Recommended)**: `localStorage` for access token + `localStorage` for refresh token — simplest, works for an MVP
> - **Option B**: `httpOnly` cookies set by the backend — more secure but requires backend changes
> 
> I'll go with **Option A** unless you prefer otherwise.

> [!IMPORTANT]
> **`'server-only'` in `zod.ts`**: Your `src/validations/zod.ts` file has `'server-only';` at line 1, but all auth client components import from it. This would crash at runtime with `server-only` enforced. I'll remove this directive since these schemas are shared between client and server.

> [!WARNING]
> **Field name mismatch**: The frontend forms use `username` as the email field name, but the backend expects `email`. The API client layer will handle mapping this, so no form changes needed.

## Proposed Changes

### 1. Backend — Enable CORS

#### [MODIFY] [main.ts](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/main.ts)
- Add `app.enableCors({ origin: 'http://localhost:3000' })` before `app.listen()`

---

### 2. API Client Layer

#### [NEW] [api-client.ts](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/lib/api-client.ts)
A thin fetch wrapper around the NestJS API:
- Base URL: `http://localhost:4000/api/v1`
- Automatically attaches `Authorization: Bearer <token>` header when available
- Typed request/response for each endpoint
- Centralized error handling (parses NestJS error responses)

#### [NEW] [auth-api.ts](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/lib/auth-api.ts)
Auth-specific API functions:
```typescript
signUp(data: { name: string; email: string; password: string })
signIn(data: { email: string; password: string })
forgotPassword(data: { email: string })
verifyCode(data: { email: string; code: string })
changePassword(data: { email: string; password: string })
refreshToken(refreshToken: string)
```

---

### 3. Auth State Management

#### [NEW] [auth-store.ts](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/lib/auth-store.ts)
Simple utility functions (no context/provider needed for now):
- `saveTokens(access, refresh)` → stores in `localStorage`
- `getAccessToken()` / `getRefreshToken()`
- `clearTokens()` → logout
- `saveUserEmail(email)` → stores email for the OTP/reset flow (multi-page flow needs to carry the email)
- `getUserEmail()`

---

### 4. Fix Shared Validation

#### [MODIFY] [zod.ts](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/validations/zod.ts)
- Remove `'server-only';` directive (line 1) — these schemas are used in client components

---

### 5. Update Auth Form Components

Each form gets an `onSubmit` handler that:
1. Calls the auth API function
2. Shows loading state on the submit button (using `isSubmitting` from react-hook-form)
3. Shows server errors inline (using `setError('root', ...)`)
4. On success: stores tokens, navigates to the next page

#### [MODIFY] [sign-in.tsx](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/app/(auth)/sign-in/sign-in.tsx)
- `onSubmit`: calls `signIn({ email: data.username, password: data.password })`
- On success: save tokens → redirect to `/patient`
- On error: show error below form
- Google button: redirect to `http://localhost:4000/api/v1/auth/google/sign`

#### [MODIFY] [sign-up.tsx](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/app/(auth)/sign-up/sign-up.tsx)
- Add `handleSubmit` to the `<form>`
- `onSubmit`: calls `signUp({ name: data.username.split('@')[0], email: data.username, password: data.password })`
- On success: save tokens + save email → redirect to `/verify-email`

> [!NOTE]
> The backend `SignUpDto` requires a `name` field. The current sign-up form doesn't have a name field — I'll derive name from the email prefix for now. If you want a dedicated name field, let me know.

#### [MODIFY] [forget-password.tsx](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/app/(auth)/forget-password/forget-password.tsx)
- `onSubmit`: calls `forgotPassword({ email: data.username })`
- On success: save email → redirect to `/verify-email`

#### [MODIFY] [otp-form.tsx](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/app/(auth)/verify-email/otp-form.tsx)
- `onSubmit`: calls `verifyCode({ email: getSavedEmail(), code: data.otp })`
- On success: redirect to `/reset-password` (if from forgot-password flow) or `/patient` (if from sign-up flow)
- "Resend Code" button: calls `forgotPassword({ email })` again

#### [MODIFY] [reset-password.tsx](file:///d:/Nile%20Unvirsity%20tasks/Collaborated_Projects/clinic/src/frontend/src/app/(auth)/reset-password/reset-password.tsx)
- Add `handleSubmit` to the `<form>`
- `onSubmit`: calls `changePassword({ email: getSavedEmail(), password: data.password })`
- On success: redirect to `/sign-in`

---

### 6. Shared UI for Server Errors

All forms will show server-side errors using react-hook-form's `root` error:
```tsx
{form.formState.errors.root && (
  <p className="text-destructive text-sm text-center animate-in fade-in">
    {form.formState.errors.root.message}
  </p>
)}
```

Submit buttons will show a loading spinner using `form.formState.isSubmitting`:
```tsx
<Button disabled={form.formState.isSubmitting}>
  {form.formState.isSubmitting ? <Loader className="animate-spin" /> : 'Submit'}
</Button>
```

## Open Questions

> [!IMPORTANT]
> 1. **Sign-up name field**: The backend requires `name`. Should I add a "Full Name" input to the sign-up form, or derive it from the email prefix?
> 2. **Post-login redirect**: After sign-in, should users go to `/patient` or somewhere else?
> 3. **Flow differentiation**: After OTP verification — how do we know if the user came from sign-up (→ go to dashboard) vs forgot-password (→ go to reset-password)? I'll use a query param like `/verify-email?flow=signup` vs `?flow=reset`.

## Verification Plan

### Manual Verification
1. Start the NestJS backend (`npm run start:dev` in root)
2. Start the Next.js frontend (`npm run dev` in `src/frontend`)
3. Test each flow:
   - Sign up → OTP → dashboard
   - Sign in → dashboard
   - Forgot password → OTP → reset password → sign in
4. Test error cases: wrong password, duplicate email, invalid OTP
