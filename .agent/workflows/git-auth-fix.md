---
description: Fix Git authentication and user configuration
---

# Fix Git Authentication

This workflow helps you switch your Git user to `bugra@xeref.ai` and resolve permission errors.

## 1. Configure Local Git User
Set your local Git identity to match the authorized account.

```powershell
git config user.name "Bugra"
git config user.email "bugra@xeref.ai"
```

## 2. Clear Cached Credentials (Windows)
The `403 Forbidden` error usually means Windows is remembering the wrong account (`bkbugra`).

1. Open **Start Menu**.
2. Type **Credential Manager** and open it.
3. Click **Windows Credentials**.
4. Look for `git:https://github.com` or `github.com`.
5. Click it and select **Remove**.

## 3. Re-authenticate
Now, try pushing again. You should be prompted to sign in.
**Important:** Sign in with the GitHub account that has access to `xeref-ai` (likely `bugra` or the one associated with `bugra@xeref.ai`).

```powershell
git push origin main
```

## 4. Verify Remote
Ensure your remotes are correct.

```powershell
git remote -v
```
If `origin` is incorrect, you can fix it:
```powershell
git remote set-url origin https://github.com/xeref-ai/xeref.git
```
