---
title: "Understanding Camera Look-At."
date: 2022-10-10T00:31:00-04:00
draft: false
tags: ["Graphics", "Matrices", "OpenGL"]
math: true
---

Often times, we want to position the camera in our scene at a particular point,
such as the head of the character in a first-person shooter or the cockpit of a
plane in a flight simulator. We also want the camera to look in the direction
that the player is trying to move.

To do this, we need to find the forward, right, and up vectors that correspond
to the desired view.

If we let $\vec{p}$ be the camera's position and $\vec{t}$ be the position of
what we want to look at, the camera's look direction is
$$\vec{l}=\vec{t}-\vec{p}\\,.$$
Conventionally, the camera looks down the negative forward axis so
$$\vec{f}=-\vec{l}\\,.$$

In order to determine the right vector, we need a reference up direction,
$\vec{up}$ (which isn't necessarily orthogonal to $\vec{f}$). This enables us
to calculate
$$\vec{r} = \vec{f} \times \vec{up}$$
and
$$\vec{u} = \vec{r} \times \vec{f}\\,.$$

Now we can use the camera position $\vec{p}$ and normalized forms of $\vec{f}$,
$\vec{r}$, and $\vec{u}$ to fill in our
[view matrix]({{< relref "view-matrix" >}}):

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

