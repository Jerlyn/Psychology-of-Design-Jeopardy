# Psychology of Design Jeopardy Game

A web-based Jeopardy game built around cognitive biases and design principles from [The Psychology of Design](https://growth.design/psychology).

## Features

- Interactive Jeopardy-style game board
- Categories based on design psychology principles: Information, Meaning, Time, and Memory
- Score tracking
- Timer for each question
- Responsive design for all device sizes
- Accessibility features:
  - High contrast mode
  - Adjustable font size
  - Keyboard navigation
  - WCAG AA compliant color contrast
  - Screen reader compatible

## Getting Started

### Prerequisites

- A modern web browser
- Git (for cloning the repository)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/psychology-design-jeopardy.git
   ```

2. Navigate to the project directory
   ```
   cd psychology-design-jeopardy
   ```

3. Open the `index.html` file in your browser or serve with a simple HTTP server

For a simple local server, you can use Python:
```
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Then navigate to `localhost:8000` in your browser.

## How to Play

1. Click on a dollar amount under any category
2. Read the question that appears
3. Type your answer in the input field
4. Click "Submit" or press Enter to submit your answer
5. You'll gain points for correct answers and lose points for incorrect ones
6. Try to answer all 20 questions to complete the game

## Project Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styling
- `script.js` - Game logic and functionality

## Accessibility Features

This game is designed with accessibility in mind:

- **High Contrast Mode**: Toggle to improve visibility for users with visual impairments
- **Larger Font Option**: Increase text size for better readability
- **Keyboard Navigation**: All game functions can be accessed using keyboard only
  - Use Tab to navigate between elements
  - Press Enter or Space to select a question
  - Press Enter to submit answers
  - Press Esc to close modals
- **ARIA attributes**: Properly labeled for screen readers
- **Color Contrast**: All text meets WCAG AA standards for contrast

## Credits

- Game based on [The Psychology of Design](https://growth.design/psychology) by Dan Benoni & Louis-Xavier Lavallée
- Content organized into Information, Meaning, Time, and Memory categories

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
