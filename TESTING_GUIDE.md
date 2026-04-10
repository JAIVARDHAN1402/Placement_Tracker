# Placement Portal - Complete Testing Guide

## 🚀 Quick Start
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📋 Complete Test Scenarios

### **1. STUDENT SIGNUP & LOGIN**
**Test Case 1.1: New Student Registration**
- [ ] Go to `/signup`
- [ ] Fill: Name, Username, Password
- [ ] Click "Create account"
- [ ] ✅ Should redirect to `/dashboard`
- [ ] ✅ Name should appear in sidebar
- [ ] ✅ Refresh page - user still logged in

**Test Case 1.2: Student Login**
- [ ] Logout first (click Logout in sidebar)
- [ ] Go to `/login`
- [ ] Enter username & password from signup
- [ ] Click "Login"
- [ ] ✅ Should redirect to `/dashboard`
- [ ] ✅ User info visible in sidebar

---

### **2. ADMIN LOGIN**
**Test Case 2.1: Hardcoded Admin**
- [ ] Go to `/admin/login`
- [ ] Username: `jai12345`
- [ ] Password: `admin123`
- [ ] Click "Login as admin"
- [ ] ✅ Should redirect to `/admin`
- [ ] ✅ Should see "⚙️ Admin Panel" in sidebar
- [ ] ✅ Refresh page - still logged in

---

### **3. STUDENT - APPLY TO COMPANY**
**Test Case 3.1: Apply from Companies Page**
- [ ] Login as student
- [ ] Click "🏢 Companies" in sidebar
- [ ] Find any company card
- [ ] Click "Apply / Track" button
- [ ] ✅ Button should change to "Already added"
- [ ] ✅ Status badge should show "Applied"
- [ ] ✅ Refresh page - application still visible
- [ ] ✅ In MongoDB, new Application document created

**Test Case 3.2: Check in My Applications**
- [ ] Click "📋 Applications" in sidebar
- [ ] ✅ Company should appear with "Applied" status
- [ ] ✅ Should show company name, role, deadline

---

### **4. STUDENT - UPDATE APPLICATION STATUS**
**Test Case 4.1: Progress Through Stages**
- [ ] In "📋 Applications" page
- [ ] Click status dropdown for any application
- [ ] Select "OA Cleared"
- [ ] ✅ Status should change immediately
- [ ] ✅ Refresh page - status persists
- [ ] ✅ MongoDB shows updated status

**Test Case 4.2: Test All Status Options**
- [ ] Update to each status: Applied → OA Cleared → Interview → Selected
- [ ] ✅ Each update should persist on refresh
- [ ] ✅ Dropdown shows all 6 options: Applied, OA Cleared, Interview, Rejected, Selected, Withdrawn

**Test Case 4.3: Mark as Withdrawn**
- [ ] Click "Mark as withdrawn" button
- [ ] ✅ Status should become "Withdrawn"
- [ ] ✅ Persists on refresh

---

### **5. STUDENT - ANALYTICS & DASHBOARD**
**Test Case 5.1: Dashboard Stats Update**
- [ ] Apply to 3 different companies
- [ ] Go to "📊 Dashboard"
- [ ] ✅ "Applied companies" should show 3
- [ ] Update 1 to "OA Cleared"
- [ ] ✅ Dashboard refreshes and shows correct count
- [ ] Mark 1 as "Rejected"
- [ ] ✅ "Rejected" count updates

**Test Case 5.2: Analytics Calculation**
- [ ] Apply to 5 companies
- [ ] Update some to "OA Cleared", some to "Interview", some "Rejected"
- [ ] ✅ Dashboard should show:
  - Total applications: 5
  - Rejections: correct count
  - OA rejected: count of rejections with failureStage: "OA"
  - Rejection rate: percentage
  - Weakness assessment based on failures

**Test Case 5.3: Advice Card**
- [ ] If no rejections yet: "No data yet"
- [ ] After OA rejections: "OA rounds are your weakest area"
- [ ] After interview rejections: "Interview rounds are your current weak spot"
- [ ] Advice changes based on pattern

---

### **6. STUDENT - ADD CUSTOM COMPANY**
**Test Case 6.1: Add Company from Dashboard**
- [ ] In "📊 Dashboard" section
- [ ] Fill "ADD YOUR COMPANY" form:
  - Company: TCS
  - Role: Software Developer
  - Package: 15 LPA
  - Deadline: 2026-04-25
  - Location: Pune
  - Mode: Hybrid
- [ ] Click "Add company"
- [ ] ✅ Form clears
- [ ] ✅ Company appears in "New Companies To Apply"
- [ ] ✅ Refresh page - company still visible

**Test Case 6.2: Add Company from Companies Page**
- [ ] Go to "🏢 Companies"
- [ ] Fill "Add Custom Company" form (same fields)
- [ ] Click "Add to tracker"
- [ ] ✅ Should appear in companies grid
- [ ] ✅ Should show "Private entry" tag (not "Campus drive")

---

### **7. ADMIN - ADD COMPANY**
**Test Case 7.1: Admin Creates Company**
- [ ] Login as admin (`jai12345` / `admin123`)
- [ ] Go to "⚙️ Admin Panel"
- [ ] Fill company form:
  - Company: Apple
  - Role: Hardware Engineer
  - Package: 45 LPA
  - Deadline: 2026-04-20
  - Location: Cupertino
  - Mode: On-site
- [ ] Click "Add company"
- [ ] ✅ Should appear in company table below
- [ ] ✅ Table shows: Name, Role, Deadline with Edit/Delete buttons

**Test Case 7.2: Edit Company**
- [ ] Click "Edit" button on any company
- [ ] Change package to "50 LPA"
- [ ] Click "Update company"
- [ ] ✅ Table updates immediately
- [ ] ✅ Refresh page - change persists

**Test Case 7.3: Delete Company**
- [ ] Click "Delete" button
- [ ] ✅ Company disappears from table
- [ ] ✅ Refresh page - still gone
- [ ] ✅ Check student can't see deleted company anymore

**Test Case 7.4: Student Sees Admin Companies**
- [ ] Logout from admin
- [ ] Login as student
- [ ] Go to "🏢 Companies"
- [ ] ✅ Should see company created by admin
- [ ] ✅ Should show "Campus drive" tag
- [ ] ✅ Can apply to it

---

### **8. LOGOUT & SESSION**
**Test Case 8.1: Logout**
- [ ] Login as student/admin
- [ ] Click "🚪 Logout" in sidebar
- [ ] ✅ Redirected to home page
- [ ] ✅ Sidebar shows login buttons, not user info

**Test Case 8.2: Session Persistence on Refresh**
- [ ] Login as student
- [ ] Refresh page (Ctrl+R)
- [ ] ✅ Still logged in
- [ ] ✅ Sidebar shows user name
- [ ] ✅ Can access all pages

**Test Case 8.3: Manual URL Navigation**
- [ ] Login as student
- [ ] Type `/admin` in URL
- [ ] ✅ Should show "Admin access required"
- [ ] ✅ Button to go to admin login

---

### **9. EDGE CASES & ERRORS**

**Test Case 9.1: Duplicate Username**
- [ ] Signup with username: `testuser`
- [ ] ✅ Account created
- [ ] Logout
- [ ] Try signup again with same username
- [ ] ✅ Should show error: "Username already taken"

**Test Case 9.2: Apply Twice**
- [ ] Apply to same company
- [ ] ✅ First apply works
- [ ] Try apply again
- [ ] ✅ Should show error: "You already have this application in your tracker"
- [ ] ✅ Application list doesn't show duplicate

**Test Case 9.3: Empty Fields**
- [ ] Try signup without name
- [ ] ✅ Form validation error (required field)
- [ ] Try add company without deadline
- [ ] ✅ Form validation error

**Test Case 9.4: Invalid Status Update**
- [ ] Update application status
- [ ] ✅ Should show only valid status options
- [ ] ✅ Can't select invalid status

---

### **10. DATA PERSISTENCE IN MONGODB**

**Test Case 10.1: Application Saved**
- [ ] Apply to company
- [ ] Open MongoDB Atlas
- [ ] Check `placement-tracker.applications`
- [ ] ✅ New document with userId, companyId, status: "Applied"
- [ ] ✅ Has appliedDate, source: "tracker"

**Test Case 10.2: Status Update Saved**
- [ ] Update status to "OA Cleared"
- [ ] Check MongoDB
- [ ] ✅ Application document has status: "OA Cleared"
- [ ] ✅ failureStage: null (no failures)

**Test Case 10.3: Company Saved**
- [ ] Add company as student
- [ ] Check `placement-tracker.companies`
- [ ] ✅ New document created
- [ ] ✅ isGlobal: false (student-added)
- [ ] ✅ createdBy: student's userId

---

## 🐛 If Something Doesn't Work

### **Problem: Applications not saving**
```
✓ Check: User is logged in (sidebar shows name)
✓ Check: No 500 error in terminal
✓ Check: Company ID is valid
✓ Browser Console (F12) for errors
```

### **Problem: Company not showing for other user**
```
✓ Check: isGlobal is set correctly
✓ Check: Admin-added should have isGlobal: true
✓ Check: Refresh page to fetch latest
```

### **Problem: Analytics showing wrong numbers**
```
✓ Check: All applications have correct status
✓ Check: Dashboard shows live count after update
✓ Check: MongoDB failureStage is set correctly for rejections
```

### **Problem: Logout not working**
```
✓ Check: Sidebar logout button visible
✓ Check: Browser console for fetch errors
✓ Check: JWT cookie being cleared
```

---

## 📱 Browser Console Debugging

Press **F12** → **Console** tab and look for:
- ❌ Any red errors
- ✅ Network tab shows 200 status codes
- ✅ No "401 Unauthorized" errors

Common issues:
```
❌ "Cannot read property 'id' of null"
   → Company not loaded, try refresh

❌ "MongooseError: Cannot read property '_id'"
   → ID format issue, clear browser cache

❌ "401 Unauthorized on /api/auth/me"
   → JWT expired, login again
```

---

## ✅ Checklist for "Portal Ready"

- [ ] Signup creates account in DB
- [ ] Login/logout works
- [ ] Apply to company saves in DB
- [ ] Status updates persist
- [ ] Admin can add companies
- [ ] Companies visible to all students
- [ ] Analytics calculate correctly
- [ ] Page refresh keeps user logged in
- [ ] No errors in console
- [ ] Sidebar navigation works on mobile

---

**If all tests pass, your portal is PRODUCTION READY!** 🎉
