# 🌟 EduSchedulAI: Landing Page Showcase

![Status](https://img.shields.io/badge/Status-Live%20Demo-brightgreen)
![Framework](https://img.shields.io/badge/Next.js-15.5.4-black)
![Styling](https://img.shields.io/badge/Tailwind%20CSS-v4%20|%20oklch-06B6D4)
![Graphics](https://img.shields.io/badge/Graphics-GSAP%20|%20OGL%20|%20Framer%20Motion-purple)

## ✨ Overview: Automate Your School's Timetable with AI

This project's landing page is a performance-focused, visually immersive showcase for a hypothetical AI Timetable Generator. The page effectively blends cutting-edge web technologies and custom graphics to create a professional, modern user experience, guiding visitors from product introduction to conversion (Sign Up).

---

## 🎨 Visual & Technical Highlights

The design is built on a custom, dark-themed foundation (`bg-black`) to emphasize the modern, AI-powered nature of the product.

### 1. Interactive Generative Background
* **DotGrid Component:** A full-bleed background uses a custom `DotGrid` component built with **GSAP (GreenSock)** and its `InertiaPlugin`.
* **Physics-Based Interaction:** The dots react to mouse movement (hovering and rapid movement) and mouse clicks by displacing based on proximity, velocity, and shock radius. This demonstrates a strong grasp of custom canvas rendering and physics simulation.

### 2. Header Orb Graphic
* **Custom WebGL Shader:** A small, vibrant "Orb" graphic in the header is rendered using **OGL**, a lightweight WebGL library.
* **Animated Uniforms:** The Orb uses GLSL shaders to create a dynamic, swirling light effect, incorporating uniform inputs for `iTime` and `hover` state, providing subtle visual interest.

### 3. Tailwind CSS & Styling
* The application uses a full-custom, dark-mode `oklch` color palette defined in `app/globals.css`, prioritizing modern CSS features and a consistent design system.
* Styling leverages utility-first **Tailwind CSS** (v4 architecture) with Shadcn/ui primitives to build all major elements, including `Card` and `Button`.

---

## 🔒 Integrated Authentication Experience

The landing page features a fully wired, production-ready authentication flow embedded directly into the frontend.

### Auth Modal (`AuthModal` component)
* **Framer Motion Transitions:** The Sign In and Sign Up forms transition between states (initial, animate, exit) using directional slide and fade animations powered by **Framer Motion**'s `AnimatePresence` for an effortless feel.
* **Full-Stack Session Management:** After successful Firebase authentication, the modal initiates a secure, server-side session using a dedicated Next.js API route (`/api/auth/session-login`).
* **Context-Driven UI:** The navigation bar and hero CTA buttons dynamically switch between *Sign In/Sign Up* and *Dashboard/Sign Out* states based on the `useAuth` hook that reads the authentication status.

---

## 🎯 Feature and Content Sections

The landing page follows a standard marketing structure to highlight product value:

| Section | Focus | Technical Implementation |
| :--- | :--- | :--- |
| **Hero** | Primary Value Proposition | Gradient text, dynamic CTA button based on Auth state. |
| **Features** | Product Capabilities | Displays three key selling points ("AI-Powered Automation," "Real-Time Editing," "Constraint Management") using the `FeatureCard` component. |
| **How It Works** | User Journey | A 3-step visualization ("Input Data," "Define Constraints," "Generate & Export") with dividing lines for visual flow. |
| **Testimonials** | Social Proof | Displays three user testimonials using the custom `TestimonialCard` component, incorporating **Lucide icons** (Star, User). |
