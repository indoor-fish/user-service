# User Service — Business Rules

## Rule 1: Merchant Email Verification
Users with the `MERCHANT` role cannot log in until their email address has been verified. This prevents fraudulent merchant accounts from transacting immediately after registration.

## Rule 2: Login Attempt Lockout
After 5 consecutive failed login attempts, an account is locked for 15 minutes. This protects against brute-force credential attacks.

## Rule 3: Admin Role Self-Assignment Prohibited
The `ADMIN` role cannot be assigned during self-registration. Admin privileges can only be granted by an existing admin via the `PATCH /admin/users/:id/role` endpoint.
