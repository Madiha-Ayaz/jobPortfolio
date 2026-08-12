I have addressed the `ReferenceError: socialLinks is not defined` in `src/components/layout/Footer.tsx`.

This error occurred because the `socialLinks` array, which contains the data for your footer links, was inadvertently removed during a previous refactoring. I have re-inserted its definition into `src/components/layout/Footer.tsx`.

Please try running your application again. This should resolve the issue.