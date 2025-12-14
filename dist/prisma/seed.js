"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    // Create admin user
    const hashedPassword = await bcrypt_1.default.hash('admin123456', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@portfolio.com' },
        update: {},
        create: {
            email: 'admin@portfolio.com',
            password: hashedPassword,
            name: 'Admin User',
        },
    });
    console.log('✅ Admin user created:', {
        id: admin.id,
        email: admin.email,
        name: admin.name
    });
    // Create sample blog posts
    const blog1 = await prisma.blog.upsert({
        where: { id: 'sample-blog-1' },
        update: {},
        create: {
            id: 'sample-blog-1',
            title: 'Getting Started with Next.js 15',
            description: 'Learn how to build modern web applications with Next.js 15',
            content: `Next.js 15 brings incredible new features for building web applications. 
      
In this post, we'll explore the latest features including:
- Server Actions
- Partial Prerendering
- Improved performance
- Better developer experience

Let's dive in and see what makes Next.js 15 so powerful!`,
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
            published: true,
        },
    });
    const blog2 = await prisma.blog.upsert({
        where: { id: 'sample-blog-2' },
        update: {},
        create: {
            id: 'sample-blog-2',
            title: 'Mastering TypeScript in 2024',
            description: 'Advanced TypeScript patterns and best practices',
            content: `TypeScript has become essential for modern web development.

Key topics covered:
- Advanced Types
- Generics and Utility Types
- Design Patterns
- Performance Optimization

Understanding these concepts will make you a better developer!`,
            image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
            published: true,
        },
    });
    console.log('✅ Sample blogs created:', [blog1.title, blog2.title]);
    // Create sample projects
    const project1 = await prisma.project.upsert({
        where: { id: 'sample-project-1' },
        update: {},
        create: {
            id: 'sample-project-1',
            title: 'E-commerce Platform',
            description: 'A full-stack e-commerce platform built with Next.js, TypeScript, and Stripe',
            thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c',
            liveUrl: 'https://example-ecommerce.com',
            githubUrl: 'https://github.com/example/ecommerce',
            features: [
                'User authentication and authorization',
                'Product catalog with search and filters',
                'Shopping cart and checkout',
                'Payment integration with Stripe',
                'Admin dashboard',
                'Order tracking',
            ],
            technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
        },
    });
    const project2 = await prisma.project.upsert({
        where: { id: 'sample-project-2' },
        update: {},
        create: {
            id: 'sample-project-2',
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates',
            thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
            liveUrl: 'https://example-tasks.com',
            githubUrl: 'https://github.com/example/tasks',
            features: [
                'Real-time collaboration',
                'Drag-and-drop interface',
                'Team management',
                'File attachments',
                'Activity tracking',
                'Mobile responsive',
            ],
            technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'Material-UI'],
        },
    });
    console.log('✅ Sample projects created:', [project1.title, project2.title]);
    console.log('🎉 Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map