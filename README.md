# Latency Visualizer

A real-time network latency visualization tool built with Next.js and Three.js. This application provides an interactive 3D globe visualization of network latency between different points, featuring heatmaps, performance metrics, and historical data.

## Features

- 3D Globe visualization using Three.js
- Real-time latency visualization with heatmap overlay
- Interactive network topology view
- Historical performance metrics
- Dynamic atmosphere and starfield effects
- Responsive control panel for data filtering
- Light/Dark theme support

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (comes with Node.js) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gurmeetpunia/Latency-Visualization.git
cd Latency-Visualization

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

## Running Locally

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Technology Stack

### Core Technologies

- [Next.js](https://nextjs.org/) (v16.0.1) - React framework for production
- [React](https://reactjs.org/) (v19.2.0) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Three.js](https://threejs.org/) (v0.181.0) - 3D graphics library

### UI Components and Styling

- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) (v9.4.0) - React renderer for Three.js
- [@react-three/drei](https://drei.pmnd.rs/) (v10.7.6) - Useful helpers for React Three Fiber
- [@headlessui/react](https://headlessui.com/) - Unstyled, accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

### Data Visualization

- [Recharts](https://recharts.org/) - Composable charting library for historical data

## Project Structure

- `/src/app` - Next.js application core files
- `/src/components` - React components including 3D visualizations
- `/src/contexts` - React context providers
- `/src/lib` - Utility functions and data handling
- `/public/textures` - 3D texture assets

## Development

### Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm run start` - Runs the built application
- `npm run lint` - Runs ESLint for code quality

## Assumptions and Design Decisions

1. **Performance Considerations**

   - The application assumes a modern browser with WebGL support
   - Optimized for desktop viewing with mobile responsiveness
   - Uses client-side rendering for real-time updates

2. **Data Structure**

   - Latency data is expected in a specific format (documented in Data.ts)
   - Real-time updates are simulated for demonstration purposes

3. **Visual Design**
   - Globe visualization prioritizes clarity over geographical accuracy
   - Color schemes chosen for optimal contrast in both light and dark modes
   - Performance metrics are displayed with a focus on readability

## License

[Specify your license here]

## Contributing

[Add your contribution guidelines here]

## Repository

The project is hosted on GitHub: [Latency-Visualization](https://github.com/gurmeetpunia/Latency-Visualization)
