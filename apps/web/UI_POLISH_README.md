# EnglishQuest Frontend - UI Polish Documentation

## 🎨 Design Overview

EnglishQuest frontend telah diperbarui dengan **modern design system** yang menggabungkan:
- 🎮 **Duolingo-style gamification** untuk user engagement
- 💻 **Computer Engineering aesthetic** dengan tech accents (blue colors)
- 🌿 **Nature-inspired green** sebagai primary brand color
- ✨ **Smooth animations & micro-interactions** untuk better UX

---

## 📦 What's New

### 1. **Tailwind Config (`tailwind.config.ts`)**
Comprehensive configuration dengan:
- **Custom color palette** (Primary: Green, Secondary: Blue, Neutral: Gray)
- **Enhanced spacing & typography** untuk readability
- **Custom animations** (float, shimmer, glow, slide-up, slide-down, fade-in)
- **Reusable component utilities** (glass, card, badge, btn, input)
- **Refined box shadows** untuk depth

### 2. **Global Styles (`globals.css`)**
Enhanced dengan:
- **CSS variables** untuk consistency
- **Smooth scrollbar styling**
- **Focus ring improvements**
- **Animation utilities** untuk quick implementations
- **Dark mode support** (optional)
- **Responsive motion preferences**

### 3. **Reusable Components**

#### `Button.tsx`
```tsx
<Button 
  variant="primary" 
  size="lg" 
  isLoading={false} 
  icon="🚀"
>
  Click Me
</Button>
```
- Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`
- Sizes: `sm`, `md`, `lg`
- Built-in loading state & animations

#### `Card.tsx`
```tsx
<Card 
  gradient="green" 
  variant="gradient" 
  hover={true}
>
  Content
</Card>
```
- Gradients: `green`, `blue`, `purple`, `orange`, `pink`
- Smooth hover animations

#### `Badge.tsx`
```tsx
<Badge variant="green" icon="🔥">
  Level 5
</Badge>
```
- Variants: `green`, `blue`, `purple`, `yellow`, `red`, `orange`

#### `Input.tsx`
```tsx
<Input 
  label="Email" 
  placeholder="..."
  error={error} 
  icon="📧"
  hint="We'll never spam"
/>
```
- Built-in validation display
- Icon support
- Error states

---

## 🎨 Pages Updated

### 1. **Landing Page (`page.tsx`)**
- ✨ Hero section dengan animated background
- 📊 Stats showcase (10K+ learners, 50+ lessons, 4.8★)
- 🎯 Features grid dengan gradient cards
- 💻 Tech stack showcase
- 🎬 Smooth scroll animations
- CTA button dengan hover effects

### 2. **Login Page (`login/page.tsx`)**
- 🔐 Modern form layout
- 👁️ Show/hide password toggle
- 💬 Error display dengan animations
- 🎯 Demo credentials hint box
- 🔄 Loading state indicator
- ← Breadcrumb ke home

### 3. **Register Page (`register/page.tsx`)**
- ✨ Enhanced form dengan password confirmation
- 📊 Real-time password strength indicator
- ✅ Field validation feedback
- 🎬 Smooth transitions
- 💡 Benefits showcase

### 4. **Dashboard Page (`learn/page.tsx`)**
- 📊 Enhanced navbar dengan badges
- 🎯 Improved level card display
- 📈 XP progress bar dengan animation
- 📑 Quick stats grid
- 🏷️ Category filter buttons
- 🎮 Lesson cards dengan hover effects & status indicators
- 📱 Responsive grid layout

---

## 🎨 Design System

### Color Palette

| Usage | Tailwind | Value | Purpose |
|-------|----------|-------|---------|
| Primary | `green-500` | `#22c55e` | Main CTA, brand |
| Secondary | `blue-500` | `#0ea5e9` | Accent, tech feel |
| Success | `green-600` | `#16a34a` | Positive actions |
| Warning | `yellow-500` | `#eab308` | Alerts, caution |
| Error | `red-500` | `#ef4444` | Errors, danger |

### Typography

- **Font**: Nunito (all weights: 400, 600, 700, 800, 900)
- **Headings**: `font-black` (900) untuk impact
- **Body**: `font-semibold` (600) untuk readability
- **Labels**: `font-bold` (700) dengan uppercase

### Spacing

- **Padding**: `p-6`, `p-8`, `px-4 py-3` (consistent)
- **Gaps**: `gap-4`, `gap-6` (uniform spacing)
- **Border Radius**: `rounded-2xl` (buttons), `rounded-3xl` (cards)

### Shadows

| Class | Value | Use |
|-------|-------|-----|
| `shadow-sm-soft` | 1px 2px | Subtle depth |
| `shadow-md-soft` | 4px 8px | Card default |
| `shadow-lg-soft` | 8px 16px | Hover state |
| `shadow-green` | Green-tinted | Brand shadows |

---

## 🎬 Animations

### Built-in Tailwind Animations
```css
animate-bounce-slow    /* Slower bounce effect */
animate-pulse-slow     /* Slower pulse */
animate-float          /* Floating motion */
animate-shimmer        /* Shimmer effect */
animate-glow           /* Glowing effect */
animate-slide-up       /* Slide in from bottom */
animate-slide-down     /* Slide in from top */
animate-fade-in        /* Fade in animation */
```

### Framer Motion Usage
```tsx
<motion.div
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ duration: 2, repeat: Infinity }}
>
  Animated Element
</motion.div>
```

---

## 📱 Responsive Breakpoints

```css
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
```

---

## 🚀 Installation & Setup

### Install Dependencies
```bash
cd apps/web
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in browser.

---

## 📝 Component Usage Guidelines

### 1. Use Badge for Quick Info
```tsx
<Badge variant="green" icon="🔥">
  Day 5 Streak
</Badge>
```

### 2. Use Card for Content Containers
```tsx
<Card gradient="green" variant="gradient">
  <h3>Title</h3>
  <p>Description</p>
</Card>
```

### 3. Use Button for Actions
```tsx
<Button 
  variant="primary" 
  size="lg"
  onClick={handleClick}
>
  Click Me
</Button>
```

### 4. Use Input for Forms
```tsx
<Input
  label="Email"
  type="email"
  placeholder="email@example.com"
  error={errorMessage}
  icon="📧"
/>
```

---

## 🎯 Best Practices

1. **Always use `font-nunito`** for consistency
2. **Use semantic colors** (green for success, red for error)
3. **Add animations with `motion.div`** for interactivity
4. **Use `variants={containerVariants}`** for staggered animations
5. **Implement **hover states** dengan `whileHover`
6. **Test on mobile** sebelum push (responsive-first design)

---

## 🔧 Configuration Files

### `tailwind.config.ts`
Konfigurasi lengkap Tailwind CSS dengan:
- Extended colors
- Custom animations
- Component plugins
- Utility classes

### `postcss.config.js`
PostCSS configuration untuk:
- Tailwind CSS
- Autoprefixer (cross-browser compatibility)

### `globals.css`
Global styles untuk:
- CSS variables
- Base element styling
- Animation keyframes
- Utility classes

---

## 📚 File Structure

```
apps/web/src/
├── app/
│   ├── page.tsx              ← Landing page
│   ├── login/page.tsx        ← Login page
│   ├── register/page.tsx     ← Register page
│   ├── learn/page.tsx        ← Dashboard
│   ├── layout.tsx            ← Root layout
│   └── globals.css           ← Global styles
├── components/
│   └── ui/
│       ├── Button.tsx        ← Button component
│       ├── Card.tsx          ← Card component
│       ├── Badge.tsx         ← Badge component
│       └── Input.tsx         ← Input component
├── stores/
│   └── authStore.ts          ← Auth state
└── lib/
    └── api.ts                ← API client
```

---

## 💡 Future Improvements

- [ ] Add dark mode toggle
- [ ] Add skeleton loaders
- [ ] Add toast notifications
- [ ] Add modal/dialog components
- [ ] Add tooltip components
- [ ] Add progress indicators
- [ ] Add carousel/slider component
- [ ] Add form validation library (React Hook Form)
- [ ] Add image optimization (Next.js Image)

---

## 🐛 Troubleshooting

### Nunito Font Not Applied?
1. Check `layout.tsx` - ensure `nunito.variable` is in className
2. Check `globals.css` - ensure `--font-nunito` CSS variable exists
3. Check `tailwind.config.ts` - ensure fontFamily is configured

### Animations Not Playing?
1. Check browser motion preferences: `prefers-reduced-motion`
2. Ensure Framer Motion is installed
3. Check console for errors

### Colors Not Matching?
1. Verify Tailwind classes: `bg-green-500` not `bg-green`
2. Check color values in `tailwind.config.ts`
3. Clear `.next` cache and rebuild

---

## 📞 Support

Untuk pertanyaan atau issues tentang UI design:
1. Check Tailwind CSS docs: https://tailwindcss.com
2. Check Framer Motion docs: https://www.framer.com/motion/
3. Check existing component examples

---

**Happy Coding! 🚀**

*Last Updated: 2026-05-12*
