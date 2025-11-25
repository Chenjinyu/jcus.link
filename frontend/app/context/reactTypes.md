Here is a **clear, practical explanation** of each React type/function. These are core tools you use every day in React (especially with TypeScript).

---

# ✅ **1. `Dispatch`**

A TypeScript type that represents a function that sends (dispatches) an action.

Used with:

* `useState`
* `useReducer`

Example:

```ts
const [count, setCount] = useState(0);
// setCount has type: Dispatch<SetStateAction<number>>
```

It means:
**“a function that accepts an action/value to update state.”**

---

# ✅ **2. `ReactNode`**

A TypeScript type that represents **anything React can render**, including:

* JSX elements
* strings
* numbers
* null
* undefined
* fragments
* portals

Example:

```ts
type Props = {
  children: ReactNode;
};
```

Useful when creating reusable components like a layout or provider.

---

# ✅ **3. `SetStateAction<T>`**

A TypeScript type representing **either**:

* a direct value
* a function that calculates a value

Example:

```ts
setCount(5); // direct value
setCount((prev) => prev + 1); // function (updater function)
```

Both are valid because they follow `SetStateAction<T>`.

---

# 🎯 React Hooks

---

# ✅ **4. `useCallback`**

Memoizes a **function**, preventing it from being recreated on every render.

Good when:

* passing functions to children
* optimizing performance

Example:

```jsx
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

Without `useCallback`, child components may re-render unnecessarily.

---

# ✅ **5. `useContext`**

Reads a value from a React Context.

Used to avoid **prop drilling**.

Example:

```jsx
const theme = useContext(ThemeContext);
```

---

# ✅ **6. `useEffect`**

Runs side effects in a component.

Examples of things that are “side effects”:

* API calls
* event listeners
* timers
* syncing data to localStorage

Example:

```jsx
useEffect(() => {
  console.log("component mounted");
}, []);
```

If you pass a dependency array, React re-runs the effect when dependencies change.

---

# ✅ **7. `useMemo`**

Memoizes a **value** (not a function).
Used when a calculation is expensive or derived state needs caching.

Example:

```jsx
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);
```

Avoids recalculating on every render.

---

# ✅ **8. `useRef`**

Holds a **mutable value** that does not cause re-renders when changed.

Good for:

* DOM refs
* storing timers
* storing previous values
* tracking values without re-rendering

Example:

```jsx
const inputRef = useRef<HTMLInputElement>(null);

<input ref={inputRef} />
```

Or storing a value:

```jsx
const countRef = useRef(0);
countRef.current += 1;
```

---

# ✅ **9. `useState`**

Manages state inside a component.

Example:

```jsx
const [count, setCount] = useState(0);
```

This gives:

* `count` → value
* `setCount` → function to update value

---

# 🎉 Summary Table

| Function / Type    | What It Does                      | When to Use                     |
| ------------------ | --------------------------------- | ------------------------------- |
| **Dispatch**       | TS type for state-update function | From `useReducer` or `useState` |
| **ReactNode**      | Anything React can render         | Component `children`            |
| **SetStateAction** | Value or updater function         | Typing `setState`               |
| **useCallback**    | Memoize a function                | Prevent child re-renders        |
| **useContext**     | Get value from Context            | Avoid prop drilling             |
| **useEffect**      | Side effects                      | API calls, listeners, timers    |
| **useMemo**        | Memoize a value                   | Expensive calculations          |
| **useRef**         | Mutable non-rendering value       | DOM, timers, previous values    |
| **useState**       | Component state                   | Simple local state              |

---

If you want, I can also give:

✅ Example of how all these are used in **one real component**
OR
✅ A cheat sheet for React Hooks with diagrams

Just tell me!
