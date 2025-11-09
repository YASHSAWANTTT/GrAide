import 'dotenv/config';
import { db } from '../app/db';
import { 
  courses, 
  sections, 
  quizzes, 
  questions, 
  professorSections, 
  studentSections,
  quizSections,
  assignments,
  attempts,
  users
} from '../app/db/schema';

// User IDs from your CSV
const STUDENT_ID = '5d8e28b8-ae9f-40f3-9822-36eb03603961';
const PROFESSOR_ID = 'c13cd94b-cfdd-493e-9aec-287c9e58bfe4';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Get the users to verify they exist
    const allUsers = await db.query.users.findMany();
    const student = allUsers.find(u => u.id === STUDENT_ID);
    const professor = allUsers.find(u => u.id === PROFESSOR_ID);

    if (!student || !professor) {
      console.error('❌ Users not found. Please ensure users exist in the database.');
      process.exit(1);
    }

    console.log('✅ Found users:', {
      student: `${student.firstName} ${student.lastName}`,
      professor: `${professor.firstName} ${professor.lastName}`,
    });

    // 1. Create a course
    console.log('📚 Creating course...');
    const [course] = await db.insert(courses).values({
      title: 'Introduction to Business Management',
      description: 'A comprehensive course covering fundamental business management principles, organizational behavior, and strategic planning.',
      status: 'ACTIVE',
      isActive: true,
    }).returning();
    console.log('✅ Created course:', course.title);

    // 2. Create sections
    console.log('📖 Creating sections...');
    const [section1] = await db.insert(sections).values({
      courseId: course.id,
      name: 'Section A - Morning',
      professorEnrollmentCode: 'PROF01',
      studentEnrollmentCode: 'STU001',
      isActive: true,
    }).returning();

    const [section2] = await db.insert(sections).values({
      courseId: course.id,
      name: 'Section B - Afternoon',
      professorEnrollmentCode: 'PROF02',
      studentEnrollmentCode: 'STU002',
      isActive: true,
    }).returning();
    console.log('✅ Created sections:', section1.name, 'and', section2.name);

    // 3. Enroll professor in section 1
    console.log('👨‍🏫 Enrolling professor...');
    await db.insert(professorSections).values({
      professorId: PROFESSOR_ID,
      sectionId: section1.id,
      status: 'ACTIVE',
    });
    console.log('✅ Professor enrolled in', section1.name);

    // 4. Enroll student in section 1
    console.log('👨‍🎓 Enrolling student...');
    await db.insert(studentSections).values({
      studentId: STUDENT_ID,
      sectionId: section1.id,
      status: 'ACTIVE',
    });
    console.log('✅ Student enrolled in', section1.name);

    // 5. Create quizzes
    console.log('📝 Creating quizzes...');
    
    // Quiz 1: Chapter 1 Quiz
    const [quiz1] = await db.insert(quizzes).values({
      title: 'Chapter 1: Business Fundamentals',
      description: 'Test your understanding of basic business concepts and principles.',
      professorId: PROFESSOR_ID,
      maxAttempts: 2,
      timeLimit: 30,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
    }).returning();

    // Quiz 2: Midterm
    const [quiz2] = await db.insert(quizzes).values({
      title: 'Midterm Exam: Management Principles',
      description: 'Comprehensive midterm covering chapters 1-5.',
      professorId: PROFESSOR_ID,
      maxAttempts: 1,
      timeLimit: 60,
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      isActive: true,
    }).returning();
    console.log('✅ Created quizzes:', quiz1.title, 'and', quiz2.title);

    // 6. Create questions for Quiz 1
    console.log('❓ Creating questions for Quiz 1...');
    await db.insert(questions).values([
      {
        quizId: quiz1.id,
        type: 'MULTIPLE_CHOICE',
        question: 'What is the primary goal of a business?',
        options: ['To make profit', 'To serve customers', 'To create jobs', 'All of the above'],
        correctAnswer: 'All of the above',
        points: 2,
        order: 1,
      },
      {
        quizId: quiz1.id,
        type: 'TRUE_FALSE',
        question: 'Strategic planning is only important for large corporations.',
        correctAnswer: 'false',
        points: 1,
        order: 2,
      },
      {
        quizId: quiz1.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Which management function involves organizing resources?',
        options: ['Planning', 'Organizing', 'Leading', 'Controlling'],
        correctAnswer: 'Organizing',
        points: 2,
        order: 3,
      },
      {
        quizId: quiz1.id,
        type: 'SHORT_ANSWER',
        question: 'Explain the concept of organizational culture and why it matters.',
        points: 5,
        order: 4,
      },
      {
        quizId: quiz1.id,
        type: 'TRUE_FALSE',
        question: 'Effective communication is essential for successful management.',
        correctAnswer: 'true',
        points: 1,
        order: 5,
      },
    ]);
    console.log('✅ Created 5 questions for Quiz 1');

    // 7. Create questions for Quiz 2
    console.log('❓ Creating questions for Quiz 2...');
    await db.insert(questions).values([
      {
        quizId: quiz2.id,
        type: 'MULTIPLE_CHOICE',
        question: 'What are the four main functions of management?',
        options: [
          'Planning, Organizing, Leading, Controlling',
          'Hiring, Firing, Training, Evaluating',
          'Marketing, Sales, Finance, Operations',
          'Strategy, Tactics, Goals, Objectives'
        ],
        correctAnswer: 'Planning, Organizing, Leading, Controlling',
        points: 3,
        order: 1,
      },
      {
        quizId: quiz2.id,
        type: 'SHORT_ANSWER',
        question: 'Describe the difference between leadership and management.',
        points: 10,
        order: 2,
      },
      {
        quizId: quiz2.id,
        type: 'MULTIPLE_CHOICE',
        question: 'Which leadership style is most effective?',
        options: ['Autocratic', 'Democratic', 'Laissez-faire', 'Depends on the situation'],
        correctAnswer: 'Depends on the situation',
        points: 2,
        order: 3,
      },
      {
        quizId: quiz2.id,
        type: 'TRUE_FALSE',
        question: 'SWOT analysis is a strategic planning tool.',
        correctAnswer: 'true',
        points: 1,
        order: 4,
      },
    ]);
    console.log('✅ Created 4 questions for Quiz 2');

    // 8. Assign quizzes to section
    console.log('📋 Assigning quizzes to sections...');
    await db.insert(quizSections).values([
      {
        quizId: quiz1.id,
        sectionId: section1.id,
        assignedBy: PROFESSOR_ID,
      },
      {
        quizId: quiz2.id,
        sectionId: section1.id,
        assignedBy: PROFESSOR_ID,
      },
    ]);
    console.log('✅ Assigned quizzes to section');

    // 9. Create assignments for student
    console.log('📝 Creating assignments...');
    const [assignment1] = await db.insert(assignments).values({
      quizId: quiz1.id,
      studentId: STUDENT_ID,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isCompleted: false,
    }).returning();

    const [assignment2] = await db.insert(assignments).values({
      quizId: quiz2.id,
      studentId: STUDENT_ID,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      isCompleted: true,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Completed yesterday
    }).returning();
    console.log('✅ Created assignments for student');

    // 10. Create a quiz attempt for quiz 2 (completed)
    console.log('📊 Creating quiz attempt...');
    const allQuestions = await db.query.questions.findMany();
    const quiz2Questions = allQuestions
      .filter(q => q.quizId === quiz2.id)
      .sort((a, b) => a.order - b.order);

    const answers: Record<string, string> = {};
    quiz2Questions.forEach((q, index) => {
      if (q.type === 'MULTIPLE_CHOICE') {
        answers[q.id] = q.correctAnswer || '';
      } else if (q.type === 'TRUE_FALSE') {
        answers[q.id] = q.correctAnswer || 'true';
      } else if (q.type === 'SHORT_ANSWER') {
        answers[q.id] = 'Leadership focuses on vision and inspiration, while management focuses on planning and organization.';
      }
    });

    const totalPoints = quiz2Questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = totalPoints; // Perfect score for demo
    const percentage = Math.round((earnedPoints / totalPoints) * 100);

    await db.insert(attempts).values({
      assignmentId: assignment2.id,
      studentId: STUDENT_ID,
      quizId: quiz2.id,
      sectionId: section1.id,
      answers,
      score: earnedPoints,
      maxScore: totalPoints,
      percentage,
      passed: percentage >= 70,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000), // Started 30 min before submission
    });
    console.log('✅ Created quiz attempt');

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 Course created`);
    console.log(`   - 2 Sections created`);
    console.log(`   - Professor enrolled in Section A`);
    console.log(`   - Student enrolled in Section A`);
    console.log(`   - 2 Quizzes created`);
    console.log(`   - 9 Questions created`);
    console.log(`   - 2 Assignments created`);
    console.log(`   - 1 Quiz attempt created`);
    console.log('\n💡 Enrollment Codes:');
    console.log(`   Section A - Professor: PROF01`);
    console.log(`   Section A - Student: STU001`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed
seed()
  .then(() => {
    console.log('✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  });

