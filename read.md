**2/2/2026**

1.I wrote an code for the change school profile(i.e meta),

- End point = /school/update/meta/:id
- method = patch
- This will update the meta profile data by following the repo architecture

  2.Wrote code for the PasswordReset

- A reusable code for student ,teacher and school.
- EndPoint = /password/reset/:id
- method = patch

**3/2/2026**
1.Clear some of the errors, and tested password reset;

2. Started Adding Teacher module

- Updated model for teacher
- updated {controller, service, repo} layers

**4/2/2026**

_1.Updated teacher Model_ - separated "teacher" into two models "teacherBIO" & "Teacher" - updated code of the controller and updated DTO - updated route and create two separate end points
for "teacher" and "teacherBio"

**6-2-2026**
completed adding teachers
Cleared the error, like adding batches and subject
Only one teacher allowed to per class
Also giving errors while inserting documents and profile
update the employedId code. given function
