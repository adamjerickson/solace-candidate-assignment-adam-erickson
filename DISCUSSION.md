## Things it should have but I didn't have time for

### Security, Validation, and Performance
- Authentication
- API input/output validation with zod
- Caching - depends on stack, Redis is most likely.
- Possibly rate limiting on the API
  - Depends if we are using api gateway or other things that might already have some of these features)

### Dev Best Practices, Error Handling, and Instrumentation
- Accessibility improvements (screen reader tests/access, color contrast validation)
- Tests (unit, integration, possibly e2e)
- Logging, front end back end. do you use DataDog or similar?
- Analytics? Do you use gtm, Segment, , Amplitude? 
- Error handling (there is basically none right now)
- Refactor, perhaps (consolidate types, split up the route.ts assuming we have other backend elements, we probably need services, modules, controllers etc (if using something like NestJS)) 
  - `page.tsx` is a little overloaded. Refactor a bit, perhaps split up into separate files.
- Bring in tailwind-merge and clsx for className normalization.

### Features and UI Enhancements
- Sorting
- Some searches may be better as filters. Specialties, for instance should probably be a multi-select filter
- Detect current location and allow limiting by location within X miles.
  - Also allow manual input with Google look up of address or zip code
- Click on an advocate and get a full page showing details, ways to book/engage with them
- Pictures of the advocates
- Styling is adequate, but not fantastic.
  - Improve the SolaceHeader