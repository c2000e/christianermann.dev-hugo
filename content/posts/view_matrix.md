---
title: "Deriving the View Matrix"
date: 2021-11-21T13:34:08-08:00
draft: false
tags: ["Graphics", "Matrices", "OpenGL"]
math: true
---

In computer graphics, the view matrix is used to transform points from
world space into camera space. Below is an explanation of how to derive this
matrix.

Let $V$ be the view matrix.
If $\vec{r}$, $\vec{u}$, and $\vec{f}$ denote the right, up, and forward
vectors of the camera and $\vec{p}$ is the camera's position, $V$ should
satisfy the following properties:
$$
    \begin{matrix}
        V_{1*} \times
        \begin{bmatrix}
            r_{x} \\\
            r_{y} \\\
            r_{z} \\\
            0
        \end{bmatrix}
        =
        \begin{bmatrix}
            1 \\\
            0 \\\
            0 \\\
            0
        \end{bmatrix},&
        V_{2*} \times
        \begin{bmatrix}
            u_{x} \\\
            u_{y} \\\
            u_{z} \\\
            0
        \end{bmatrix}
        =
        \begin{bmatrix}
            0 \\\
            1 \\\
            0 \\\
            0
        \end{bmatrix},&
        V_{3*} \times
        \begin{bmatrix}
            f_{x} \\\
            f_{y} \\\
            f_{z} \\\
            0
        \end{bmatrix}
        =
        \begin{bmatrix}
            0 \\\
            0 \\\
            1 \\\
            0
        \end{bmatrix},&
        V_{4*} \times
        \begin{bmatrix}
            p_{x} \\\
            p_{y} \\\
            p_{z} \\\
            1
        \end{bmatrix}
        =
        \begin{bmatrix}
            0 \\\
            0 \\\
            0 \\\
            1
        \end{bmatrix}
    \end{matrix}
$$
In words, the view matrix should translate the camera to the origin and rotate
it to align with the $\vec{x}$, $\vec{y}$, and $\vec{z}$ axes.

This can be expressed more concisely as the product of two matrices:
$$
    V \times
    \begin{bmatrix}
        r_{x} & u_{x} & f_{x} & p_{x} \\\
        r_{y} & u_{y} & f_{y} & p_{y} \\\
        r_{z} & u_{z} & f_{z} & p_{z} \\\
        0     & 0     & 0     & 1
    \end{bmatrix}
    =
    \begin{bmatrix}
        1 & 0 & 0 & 0 \\\
        0 & 1 & 0 & 0 \\\
        0 & 0 & 1 & 0 \\\
        0 & 0 & 0 & 1
    \end{bmatrix}
$$

To make this equation easier to solve, we can split the matrix containing our
camera parameters into the product of a translation matrix $T$ and a rotation
matrix $R$:
$$
    V \times (T \times R) = I
$$
where
$$
    \begin{matrix}
        T =
        \begin{bmatrix}
            1 & 0 & 0 & p_{x} \\\
            0 & 1 & 0 & p_{y} \\\
            0 & 0 & 1 & p_{z} \\\
            0 & 0 & 0 & 1
        \end{bmatrix},&
        R =
        \begin{bmatrix}
            r_{x} & u_{x} & f_{x} & 0 \\\
            r_{y} & u_{y} & f_{y} & 0 \\\
            r_{z} & u_{z} & f_{z} & 0 \\\
            0     & 0     & 0     & 1
        \end{bmatrix}
    \end{matrix}
$$

Solving for $V$ reveals that $V=R^{-1} \times T^{-1}$:
$$
    V =
    \begin{bmatrix}
        r_{x} & r_{y} & r_{z} & 0 \\\
        u_{x} & u_{y} & u_{z} & 0 \\\
        f_{x} & f_{y} & f_{z} & 0 \\\
        0     & 0     & 0     & 1
    \end{bmatrix}
    \times
    \begin{bmatrix}
        1 & 0 & 0 & -p_{x} \\\
        0 & 1 & 0 & -p_{y} \\\
        0 & 0 & 1 & -p_{z} \\\
        0 & 0 & 0 & 1
    \end{bmatrix}
$$

And with some minor simplification,
$$
    V
    =
    \begin{bmatrix}
        r_{x} & r_{y} & r_{z} & -(\vec{r} \cdot \vec{p}) \\\
        u_{x} & u_{y} & u_{z} & -(\vec{u} \cdot \vec{p}) \\\
        f_{x} & f_{y} & f_{z} & -(\vec{f} \cdot \vec{p}) \\\
        0     & 0     & 0     & 1
    \end{bmatrix}
$$

When we're ready to render our scene, we can apply $V$ to each vertex $\vec{q}$
by calculating
$$
    V \times \vec{q}
$$
in our vertex shader.

