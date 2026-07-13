# Frontend Mentor - FX Checker solution

This is a solution to the [FX Checker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [What I Learned](#what-i-learned)
  - [Key Decisions](#key-decisions)
  - [Engineering Problems](#engineering-problems)
  - [Known Limitations](#known-limitations)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: (https://your-solution-url.com)
- Github Project (https://github.com/constFormek/fx-checker)
- Live Site URL: (https://your-live-site-url.com)

## My process


Jasne. Copyedit, nie przepisywanie: treść jest twoja, ruszam tylko gramatykę, formatowanie i martwe notatki. Zero em dashy.
markdown## What I learned

**Handling hydration issues**

The first feature I completed was the Converter. It needed to fetch a few things up front, like the list of currencies and the initial pair. I ran into hydration issues while trying to display that data, because I couldn't use the store inside `page.tsx`, which is a server component. I wrote a client component called `CurrencyHydrator` to call the store and populate it with the currency list.

## Key decisions

**Zustand over Context API**

The app needed global state for the currency pair, favorites and the conversion log. Context re-renders every consumer whenever any part of the value changes, so a component reading only `pair` would re-render when `favorites` updated. Zustand lets each component subscribe to a slice. The `persist` middleware also covered localStorage for favorites and the conversion log without extra code, though it forced me to handle hydration mismatches by rehydrating manually after mount.

**Trade-off:** an extra dependency for an app small enough that Context would have worked. I'd make the same call again. The selector-level subscriptions were worth it.

**What goes in the store**

The rule I settled on: state shared across distant components goes in the store, state used by one component or its children stays local. I struggled with this for a long time before it clicked. The moment a feature like favorites started forcing me into prop drilling, I knew where it belonged.

**Converter hook and Zustand data separation**

After finishing the Converter section I started on the tab system, and immediately hit a wall: the tabs needed data that lived inside the Converter, specifically the active currency pair and the amount.

**Why:** two separate problems had grown together. All of the Converter state was local, so nothing outside it could read the pair or the amount. On top of that, the component mixed UI markup with calculation and formatting logic, which made it hard to read and harder to pull anything out of.

**The fix:** I split the state by asking one question about each piece of data: am I going to use this anywhere else in the app? If yes, it went to the Zustand store. If not, it stayed local. That took a few iterations, but the rule made every case decidable instead of a judgment call.

The tangled UI then became a separate concern. I extracted all the data handling into a custom hook and left the component to render what it returns, so each file has one reason to change.

## Engineering problems

**viewBox vs px**

The chart is rendered as SVG, with text elements as labels along the bottom and left. My first approach used a fixed viewBox base of 1000.

**Why:** viewBox units are not pixels. The scale is `container width / viewBox width`. With a 300px container the scale was 0.3, so a font size of 10 rendered as 3px. On desktop the same value rendered as 10px. The units only equal pixels when you make them equal.

**The fix:** a ResizeObserver that measures the container's real width and feeds it in as the viewBox width. The scale becomes 1, and one unit is one pixel. The height is never measured, only derived: `plotHeight = plotWidth / ratio`, with ratios taken from the design (1:1 mobile, 2.3:1 tablet, 3.5:1 desktop).

**Focus outline built with a wrapper**

The design called for a focus outline offset 2px from the element. My approach: wrap the element in a `relative` container and add an absolutely positioned span with a negative inset. This broke every dropdown in the app, because each focusable element painted on top of them.

**Why:** `position: relative` makes an element positioned, and positioned elements paint above non-positioned ones in the same stacking context. That is CSS paint order, not a bug.

**The fix:** `outline` with `outline-offset` directly on the element. Visually identical, takes no space in layout so there is no shift, and it creates no stacking context. My wrapper had been a manual reimplementation of a property that already existed.

**Sunday NaN**

While building a shared fetching function for the Ticker, Compare and Favorites features, I restructured the response object and forgot to handle the case where the data set is incomplete. It bit me on a Sunday: the Ticker was rendering `NaN` in both the rate and the change fields.

**Why:** on weekends and holidays the Frankfurter API returns no quotes, because it only publishes on trading days. My cross-rate function was receiving `undefined` for the missing day, and `NaN` propagated silently through every calculation downstream.

**The fix:** I was asking the wrong question. I had been filtering for *the last N calendar days*, which returns nothing at all when those days are a weekend. What I actually wanted was *the last N trading sessions*. So I fetch with a 7-day buffer to cover holidays and long weekends, then take the tail of the response instead of filtering by date. The number of points on the chart is now deterministic and no longer depends on which holidays fall inside the range.

## Known limitations

**Currency input**

1. **Formatting on blur.** Formatting only runs on the inactive input, which causes a problem: once the number is reformatted, it no longer passes the regex, and the user can't type in the second field. The only way out is to delete the whole number and start again.

2. **Hover and focus states not matching the text width.** I tried several times to match the design, where the hover underline and the focus box hug the text. I learned about the `field-sizing` property, but every attempt caused a bad layout shift. I couldn't get it working in time.

**Other limitations**

1. `lib/helpers.ts` collects a lot of unrelated functions and should be split by responsibility.

2. Some components carry dense, tangled logic that made me lose my place in the code more than once. A refactor didn't fit in the time I had left.

### Built with

- React.js - [React](https://reactjs.org/) 
- Next.js - [Next.js](https://nextjs.org/) 
- Typescript [Typescript](https://www.typescriptlang.org/docs/)
- Tailwind CSS [TailwindCSS](https://tailwindcss.com/ )
- Mobile-first workflow
- Zustand [Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)
- Tanstack Query [TanstackQuery](https://tanstack.com/query/latest/docs/framework/react/overview)
- Frankfurter API [Frankfurter](https://frankfurter.dev/)
### AI Collaboration

For this project I used Claude in the desktop app. Each time I started a new conversation I used the /learn skill to make the AI guide me towards an answer instead of handing me one. It pushed back on my decisions until I could justify them. I wrote every line of this codebase myself.

This worked best on problems where I had the pieces but hadn't assembled them:

1. **calculateX / calculateY for the chart** - I knew what I had to do, but I couldn't get it into code.
2. **TanStack Query key design** - I didn't fully grasp how to work with query keys; Claude explained the mental model clearly.
3. **Zustand persist middleware** - a case of not knowing what I didn't know. Claude suggested `persist` instead of hand-rolling localStorage logic, since Zustand was already set up.

When something got genuinely complex and overwhelming, I switched approach and asked for explicit steps with explanations instead. Knowing when to stop wrestling and ask directly turned out to be its own skill.

**What didn't work:** At certain points I leaned on the AI too much and stopped doing the thinking myself. I also had to push back when Claude confidently suggested things that were wrong - for example, when I needed the bounds of the SVG chart, it proposed calculations to derive them, when the values had been there all along: the highest and lowest rates *are* the Y bounds, and the first and last points *are* the X bounds.

## Author

Oscar ConstFormek
- Website - [Fx Checker](https://fx-checker-pkil.vercel.app/)
- Repository - [Github](https://github.com/constFormek)
- Frontend Mentor - [@constFormek](https://www.frontendmentor.io/profile/constFormek)




