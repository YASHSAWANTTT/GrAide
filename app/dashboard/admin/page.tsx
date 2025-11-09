import { db } from '@/app/db';
import { courses, sections, users } from '@/app/db/schema';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BookOpen, Users as UsersIcon, Layers } from 'lucide-react';
import { CourseFormModal } from '@/components/admin/CourseFormModal';
import AdminSidebar from '@/components/AdminSidebar';
import { getOrCreateUser } from '@/lib/getOrCreateUser';

export default async function AdminDashboardPage() {
  const user = await getOrCreateUser();
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  // Fetch all courses, sections, and users for analytics
  const allCourses = await db.query.courses.findMany();
  const allSections = await db.query.sections.findMany();
  const allUsers = await db.query.users.findMany();
  
  // Calculate additional stats
  const activeCourses = allCourses.filter(c => c.isActive).length;
  const activeSections = allSections.filter(s => s.isActive).length;
  const students = allUsers.filter(u => u.role === 'STUDENT').length;
  const professors = allUsers.filter(u => u.role === 'PROFESSOR').length;
  const admins = allUsers.filter(u => u.role === 'ADMIN').length;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-screen bg-[#030303] flex">
        {/* Sidebar */}
        <AdminSidebar active="dashboard" />
        {/* Main Content */}
        <main className="flex-1 flex flex-col py-10 px-4 md:px-8 overflow-x-hidden">
          {/* Header */}
          <section className="w-full max-w-7xl mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, {user.firstName || 'Admin'}!
            </h1>
            <p className="text-white/60 text-lg">Here's your platform overview</p>
          </section>

          {/* Analytics Section */}
          <section className="w-full max-w-7xl mx-auto mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="rounded-xl shadow-lg bg-white/10 border border-white/10 hover:shadow-2xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/60">Total Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{allCourses.length}</div>
                  <p className="text-xs text-white/40">Courses</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-lg bg-white/10 border border-white/10 hover:shadow-2xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/60">Total Sections</CardTitle>
                  <Layers className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{allSections.length}</div>
                  <p className="text-xs text-white/40">Sections</p>
                </CardContent>
              </Card>
              <Card className="rounded-xl shadow-lg bg-white/10 border border-white/10 hover:shadow-2xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-white/60">Total Users</CardTitle>
                  <UsersIcon className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{allUsers.length}</div>
                  <p className="text-xs text-white/40">Users</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="w-full max-w-7xl mx-auto mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Creation */}
              <Card className="rounded-xl shadow-lg bg-white/10 border border-white/10 hover:shadow-2xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Course Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CourseFormModal mode="create" />
                </CardContent>
              </Card>
              {/* Add more quick actions here if needed */}
            </div>
          </section>

          {/* Courses List */}
          <section className="w-full max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">All Courses</h2>
            {allCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map(course => {
                  const safeCourse = {
                    ...course,
                    description: course.description ?? undefined,
                  };
                  return (
                    <Card key={course.id} className="rounded-xl shadow-lg bg-white/10 border border-white/10 hover:shadow-2xl transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg text-white">{course.title}</CardTitle>
                        <BookOpen className="w-4 h-4 text-blue-400 ml-2" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <span className="text-white/60 text-sm">{course.description || 'No description'}</span>
                          <div className="flex gap-2 mt-4">
                            <CourseFormModal mode="delete" course={safeCourse} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="rounded-xl shadow-lg bg-white/10 border border-white/10">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="w-12 h-12 text-white/40 mb-4" />
                  <p className="text-white/60 text-lg mb-2">No courses yet</p>
                  <p className="text-white/40 text-sm mb-4">Create your first course to get started</p>
                  <CourseFormModal mode="create" />
                </CardContent>
              </Card>
            )}
          </section>
        </main>
      </div>
    </SidebarProvider>
  );
} 