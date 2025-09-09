# Decision Log

This document records key decisions made during the project's development.

## 2024-09-06: Initial Architecture

*   **Pattern:** Model-View-Controller (adapted for API).
*   **Domain:** `Rover` and `Grid` models are pure data containers. A `RoverController` contains all the business logic for movement and interaction.
*   **API:** FastAPI is used to expose the `RoverController` functionality over a simple REST endpoint.
*   **Rationale:** This separation of concerns keeps the core domain logic (the rover's movement rules) completely independent of the delivery mechanism (the API). It's easy to test the controller in isolation and could be adapted for a CLI or other interface later.

## 2024-09-07: Frontend and Visualization

*   **Framework:** React with Vite for the frontend build tool.
*   **UI Library:** Mantine for pre-built components to accelerate UI development.
*   **3D Rendering:** Three.js for rendering the rover, grid, and environment.
*   **Rationale:** This stack provides a modern, fast development experience for building a rich, interactive user interface, which is becoming a core requirement of the project.

## 2024-09-08: Project Vision Expansion: Solar System Explorer

*   **Concept:** Evolve the single-grid Kata into an interactive solar system simulation. The core rover logic remains, but the context becomes grander and more visual.
*   **Core Features:**
    *   The 3D view will feature a selectable planet (as a sphere).
    *   The control panel will allow users to pick a planet from the solar system.
    *   Selecting a planet will update the 3D model's size, texture, and the corresponding grid dimensions for the rover.
    *   Future enhancements will include realistic scaling and camera controls (zoom) to handle vast differences in planet sizes.
*   **Rationale:** This pivot dramatically increases the project's engagement factor and provides a rich context for exploring more advanced Three.js and UI concepts. It transforms a simple logic puzzle into a visually compelling interactive experience.