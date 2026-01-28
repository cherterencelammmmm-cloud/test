# AGENTS.md - Repository Guidelines for Coding Agents

## Project Overview
This is a collection of browser-based HTML5 games with a modern, responsive design. The repository contains individual game pages and a main index that serves as a game hub with filtering and search capabilities.

## Build/Test Commands
Since this is a static HTML/CSS/JavaScript project, there are no build commands. Testing is done by:

```bash
# Open games in browser for manual testing
# Use browser developer tools for debugging
# Test responsive design with device emulation
```

## Code Style Guidelines

### HTML Structure
- Use HTML5 doctype: `<!DOCTYPE html>`
- Set language attribute: `<html lang="zh-TW">` or `<html lang="zh-HK">`
- Include proper viewport meta tag for mobile responsiveness
- Use semantic HTML5 elements (`<header>`, `<main>`, `<footer>`, `<nav>`)
- Structure content with logical sectioning

### CSS Architecture
- Use CSS custom properties (variables) for theming and consistency
- Organize styles with clear section comments
- Follow mobile-first responsive design principles
- Use flexbox and grid for layouts
- Implement smooth transitions and micro-interactions

#### CSS Variable Naming Pattern
```css
:root {
    --macaron-pink: #FFB7B2;
    --glass-bg-light: rgba(255, 255, 255, 0.55);
    --text-main: #2c3e50;
    --neon-blue: #007aff;
}
```

#### Common CSS Classes
- `.container` - Main content wrapper with max-width and centering
- `.game-card` - Individual game preview cards
- `.filter-btn` - Category filter buttons
- `.badge` - Status indicators (HOT, NEW)
- `.icon-box` - Game icon containers

### JavaScript Patterns
- Use modern ES6+ features (arrow functions, const/let, template literals)
- Implement event delegation for dynamic content
- Use `requestAnimationFrame` for smooth animations
- Follow modular function organization
- Handle touch events for mobile compatibility

#### Common JavaScript Structure
```javascript
// 1. Element selection
const element = document.getElementById('id');
const elements = document.querySelectorAll('.class');

// 2. Event listeners
element.addEventListener('click', handlerFunction);

// 3. Animation loops
function animate() {
    requestAnimationFrame(animate);
    // animation logic
}
animate();
```

### File Naming Conventions
- Use lowercase with hyphens: `game-name.html`
- Main index: `index.html`
- Game files should be descriptive: `2048game.html`, `snake.html`

### Internationalization
- Primary language: Traditional Chinese (zh-TW/zh-HK)
- Use Chinese characters in UI text and game content
- Include English translations where helpful for code comments

### Responsive Design Requirements
- Mobile-first approach
- Breakpoints: 768px (tablet), 480px (mobile)
- Use relative units (rem, %, vw, vh)
- Implement touch-friendly interactions
- Test on various screen sizes

### Performance Guidelines
- Optimize images and assets
- Use CSS transforms for animations (better performance than position changes)
- Implement lazy loading where appropriate
- Minimize reflows and repaints

### Accessibility Standards
- Use semantic HTML elements
- Include proper ARIA labels where needed
- Ensure keyboard navigation support
- Provide sufficient color contrast
- Include focus states for interactive elements

### Game-Specific Patterns
- Canvas-based games should use proper scaling for high-DPI displays
- Implement pause/resume functionality
- Include score tracking and local storage for high scores
- Add visual and audio feedback for user actions

### Code Organization
- Keep CSS in `<style>` tags within HTML files for simplicity
- Organize JavaScript in `<script>` tags at the end of `<body>`
- Use clear section comments in both CSS and JavaScript
- Group related functionality together

### Common UI Components
- Glass morphism effects with backdrop-filter
- Gradient backgrounds
- Smooth hover states and transitions
- Card-based layouts for game selection
- Search and filter functionality

### Browser Compatibility
- Target modern browsers (Chrome, Firefox, Safari, Edge)
- Use vendor prefixes where necessary (-webkit-, -moz-)
- Test on both desktop and mobile browsers
- Graceful degradation for older browsers

### Security Considerations
- No server-side code, all client-side
- Use HTTPS for external resources (CDNs, fonts)
- Validate user input in JavaScript games
- Avoid eval() and other potentially dangerous functions

### Git Commit Guidelines
- Use descriptive commit messages
- Focus on one feature or fix per commit
- Include file context in commit messages when helpful

## Testing Approach
- Manual testing in browser developer tools
- Responsive design testing with device emulation
- Cross-browser compatibility testing
- Performance testing with browser dev tools
- User interaction testing on both desktop and mobile

## Common Issues to Avoid
- Don't use fixed positioning that breaks responsive layout
- Avoid inline styles (use CSS classes instead)
- Don't forget touch event handlers for mobile games
- Avoid blocking the main thread with heavy computations
- Don't use alert() - use custom UI elements instead

## External Dependencies
- Google Fonts for typography
- Font Awesome or emoji icons for game icons
- No JavaScript frameworks - use vanilla JS only