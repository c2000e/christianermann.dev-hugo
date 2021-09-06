---
title: "Unbind Your Vertex Array Objects."
date: 2021-08-25T14:33:02-05:00
draft: false
tags: ["OpenGL", "C"]
---

When I first started learning about OpenGL, I always made sure to unbind each resource as soon as I was done using it. Over time I became more lenient with unbinding, as in many cases leaving resources bound is okay and leads to fewer API calls.

In addition, when I'm developing on my PC I have access to the newer Direct State Access (DSA) functions, so binding resources isn't something I have to worry about as much. However, I do a fair amount of programming on my macbook which means I don't always have access to the DSA functions.

I was working on a project recently that involved the vertex and index data for a mesh frequently changing. The actual mesh struct has a bit more going on, but we can think of it like this for now:

{{<highlight c>}}
typedef struct {
    Vec3 *vertices;
    GLuint *indices;
    GLuint vao;
    GLuint vbo;
    GLuint ebo;
} Mesh;
{{</highlight>}}

So when it comes time to update the vertex or index data, we map the vertex buffer object to the vertices pointer and the element buffer object to the indices pointer. Then we can write all of our vertex and index data directly to the buffers, and then unmap them when we're all done and need to draw.


{{<highlight c>}}
...

glBindBuffer(GL_ARRAY_BUFFER, mesh->vbo);
mesh->vertices = glMapBuffer(GL_ARRAY_BUFFER, GL_WRITE_ONLY);

glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh->ebo);
mesh->indices = glMapBuffer(GL_ELEMENT_ARRAY_BUFFER, GL_WRITE_ONLY);

// While we have the buffers mapped, we can write data directly to
// mesh->vertices and mesh->indices.

glBindBuffer(GL_ARRAY_BUFFER, mesh->vbo);
glUnmapBuffer(GL_ARRAY_BUFFER);
mesh->vertices = NULL

glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, mesh->ebo);
glUnmapBuffer(GL_ELEMENT_ARRAY_BUFFER);
mesh->indices = NULL

// Now that the buffers are unmapped, we can draw the mesh again.

...
{{</highlight>}}

Leaving the buffers bound in the above snippet didn't cause problems and seemed a reasonable thing to do to reduce unnecessary OpenGL calls.
The issues I was running into were actually caused by how I was drawing each mesh: 

{{<highlight c "">}}
...

glBindVertexArray(mesh->vao);
glDrawElements(...);

...
{{</highlight>}}

Since I wasn't unbinding the mesh's vertex array object when I finished drawing it, when I updated another mesh's vertex or index data and bound that mesh's buffer objects, the vertex array object I forgot to unbind would now be using the incorrect buffers to draw with.

Luckily, there was a simple fix, and now I know to be more careful with unbinding vertex array objects:

{{<highlight c>}}
...

glBindVertexArray(mesh->vao);
glDrawElements(...);
glBindVertexArray(0);

...
{{</highlight>}}
