var express = require('express');
var router = express.Router();

const db = require('../utils/db');

// Assignments
router.post('/assignment', async function (req, res, next) {
  const { userTypeCode = null, userId } = req.body;

  let query = `select * FROM assignment ORDER BY title`;

  try {
    if (userTypeCode === 'FACULTY') {
      query = `
  
      SELECT
  
      a.assignmentId,
      a.title,
      a.description,
      a.date,
      a.point,
      a.isPublished,

      s.semesterId,

      s.semesterName,
  
      c.courseId, c.title AS courseTitle,

      fc.facultyId
  
      FROM assignment a
  
      LEFT JOIN course c ON a.courseId = c.courseId

      LEFT JOIN facultycourse fc ON fc.courseId = c.courseId

      LEFT JOIN semester s ON s.semesterId = c.semesterId
  
      WHERE fc.facultyId = ${userId}

      GROUP BY a.assignmentId

      ORDER BY a.title  
      
      `;
    }

    if (userTypeCode === 'STUDENT') {
      query = `
  
      SELECT
  
      a.assignmentId,
      a.title,
      a.description,
      a.date,
      a.point,
      a.isPublished,
  
      c.courseId, c.title AS courseTitle,
    
      s.semesterId,

      s.semesterName,

      sc.studentId
  
      FROM assignment a
  
      LEFT JOIN course c ON a.courseId = c.courseId

      LEFT JOIN studentcourse sc ON sc.courseId = c.courseId

      LEFT JOIN semester s ON s.semesterId = c.semesterId
  
      WHERE sc.studentId = ${userId} AND a.isPublished = 'yes'

      GROUP BY a.assignmentId

      ORDER BY a.title  
      
      `;
    }

    let list = await db.customQuery(query);

    res.json(list);
  } catch (error) {
    res.json(error);
  }
});

router.get('/assignment/:id', async function (req, res, next) {
  try {
    let assignmentId = req.params.id;

    let [record] = await db.getRecords('assignment', { assignmentId });

    res.json(record);
  } catch (error) {
    res.json(error);
  }
});

router.post('/create-assignment', async function (req, res, next) {
  try {
    let reqBody = req.body;

    let record = await db.addRecord('assignment', reqBody);

    res.json({ record, status: 200 });
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.put('/assignment/:id', async function (req, res, next) {
  try {
    let assignmentId = req.params.id;

    const { isPublished } = req.body;

    let data = {
      isPublished,
    };

    let where = {
      assignmentId,
    };

    let [record] = await db.updateRecord('assignment', data, where);

    res.json(record);
  } catch (error) {
    res.json(error);
  }
});

router.put('/quiz/:id', async function (req, res, next) {
  try {
    let quizId = req.params.id;

    const { isPublished } = req.body;

    let data = {
      isPublished,
    };

    let where = {
      quizId,
    };

    let [record] = await db.updateRecord('quiz', data, where);

    res.json(record);
  } catch (error) {
    res.json(error);
  }
});

//Quiz
router.post('/quiz', async function (req, res, next) {
  const { userTypeCode = null, userId } = req.body;

  let query = `select * FROM quiz ORDER BY title`;

  try {
    if (userTypeCode === 'FACULTY') {
      query = `
    
        SELECT
    
        q.quizId,
        q.title,
        q.description,
        q.date,
        q.point,
        q.isPublished,
        q.questions,

        s.semesterId,
        s.semesterName,
    
        c.courseId, 
        c.title AS courseTitle,
  
        fc.facultyId
    
        FROM quiz q
    
        LEFT JOIN course c ON q.courseId = c.courseId
  
        LEFT JOIN facultycourse fc ON fc.courseId = c.courseId

        LEFT JOIN semester s ON s.semesterId = c.semesterId
    
        WHERE fc.facultyId = ${userId}
  
        GROUP BY q.quizId
  
        ORDER BY q.title  
        
        `;
    }

    if (userTypeCode === 'STUDENT') {
      query = `
    
        SELECT
    
        q.quizId,
        q.title,
        q.description,
        q.date,
        q.point,
        q.isPublished,
        q.questions,

        s.semesterId,
        s.semesterName,
    
        c.courseId, 
        c.title AS courseTitle,
  
        sc.studentId
    
        FROM quiz q
    
        LEFT JOIN course c ON q.courseId = c.courseId
  
        LEFT JOIN studentcourse sc ON sc.courseId = c.courseId
        
        LEFT JOIN semester s ON s.semesterId = c.semesterId
    
        WHERE sc.studentId = ${userId} AND q.isPublished = 'yes'
  
        GROUP BY q.quizId
  
        ORDER BY q.title  
        
        `;
    }

    let list = await db.customQuery(query);

    res.json(list);
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.get('/quiz/:id', async function (req, res, next) {
  try {
    let quizId = req.params.id;

    let [record] = await db.getRecords('quiz', { quizId });

    res.json(record);
  } catch (error) {
    res.json(error);
  }
});

router.post('/create-quiz', async function (req, res, next) {
  try {
    let reqBody = req.body;

    let record = await db.addRecord('quiz', reqBody);

    res.json({ record, status: 200 });
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

// Announcements
router.get('/announcement', async function (req, res, next) {
  try {
    let query = `
    SELECT 
    a.announcementId,
    a.title,
    a.description,
    a.date,
    a.section,
    a.createdBy,
    u.name AS createdByName
   
    FROM announcement a

    LEFT JOIN users u ON u.userId = a.createdBy

    ORDER BY date DESC

  `;
    let list = await db.customQuery(query);

    console.log('list: ', list);
    res.json(list);
  } catch (error) {
    res.json(error);
  }
});

router.post('/announcement', async function (req, res, next) {
  try {
    let reqBody = req.body;

    let record = await db.addRecord('announcement', reqBody);

    res.json({ record, status: 200 });
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

// Score
router.post('/score', async function (req, res, next) {
  try {
    let query = `
    SELECT
    
    s.scoreId,
    s.score,
    s.type,
    s.referenceId,
    s.date,

    a.assignmentId, 
    a.title AS assignmentTitle,

    q.quizId,
    q.title AS quizTitle,

    c.courseId,
    c.title AS courseTitle,

    sem.semesterId,
    sem.semesterName,

    CASE
        WHEN s.type = 'quiz' THEN q.title
        WHEN s.type = 'assignment' THEN a.title
        ELSE NULL
    END AS title,

    CASE
        WHEN s.type = 'quiz' THEN q.description
        WHEN s.type = 'assignment' THEN a.description
        ELSE NULL
    END AS description,

    CASE
        WHEN s.type = 'quiz' THEN q.point
        WHEN s.type = 'assignment' THEN a.point
        ELSE NULL
    END AS point
    
    FROM score s
    LEFT JOIN assignment a ON a.assignmentId = s.referenceId AND s.type = 'assignment' 
    LEFT JOIN quiz q ON q.quizId = s.referenceId AND s.type = 'quiz' 

    LEFT JOIN course c ON c.courseId = a.courseId OR c.courseId = q.courseId

    LEFT JOIN semester sem ON sem.semesterId = c.semesterId

    WHERE s.userId = ${req.body.userId};

  `;

    console.log('QUIZ: ', query);
    let list = await db.customQuery(query);

    res.json(list);
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.post('/student-score-list', async function (req, res, next) {
  try {
    const { courseId, assignmentId = null, type, quizId = null } = req.body;

    let query = ``;

    if (type === 'assignment') {
      query = `
      SELECT
      u.userId,
      u.name,
      u.email,
      a.assignmentId,
      sc.courseId,
      s.score,
      s.type
      FROM users u
      LEFT JOIN studentcourse sc ON sc.studentId = u.userId AND sc.courseId = ${courseId}
      JOIN assignment a ON a.courseId = sc.courseId AND a.assignmentId = ${assignmentId}
      LEFT JOIN score s ON s.referenceId = a.assignmentId AND s.type = 'assignment' AND s.userId = u.userId
      WHERE u.userType = 3;
  
    `;
    } else {
      query = `
      SELECT
      u.userId,
      u.name,
      u.email,
      q.quizId,
      sc.courseId,
      s.score,
      s.type
      FROM users u
      LEFT JOIN studentcourse sc ON sc.studentId = u.userId AND sc.courseId = ${courseId}
      JOIN quiz q ON q.courseId = sc.courseId AND q.quizId = ${quizId}
      LEFT JOIN score s ON s.referenceId = q.quizId AND s.type = 'quiz' AND s.userId = u.userId
      WHERE u.userType = 3;
  
    `;
    }

    let list = await db.customQuery(query);

    res.json(list);
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.post('/update-score', async function (req, res, next) {
  try {
    console.log('REQ.BODY: ', req.body);
    const { userId, referenceId, type, score, date } = req.body;

    let record = {};
    let where = {
      userId,
      type,
      referenceId,
    };

    let existingRecord = await db.getRecords('score', where);

    if (existingRecord && existingRecord.length) {
      let where1 = {
        scoreId: existingRecord[0].scoreId,
      };

      let data = {
        score,
      };

      record = await db.updateRecord('score', data, where1);
    } else {
      let data = {
        score,
        userId,
        referenceId,
        type,
        date,
      };
      record = await db.addRecord('score', data);
    }

    res.json({ record, success: true });
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

// Course
router.post('/course', async function (req, res, next) {
  try {
    let where = ['1=1'];

    let subQueryWhere = [' fc.courseId = c.courseId ', ' fc.facultyId = u.userId '];

    const { faculty = [], semester = [], student = [], userTypeCode = null } = req.body;

    if (faculty && faculty.length) {
      subQueryWhere.push(` fc.facultyId IN (${faculty.join(',')})  `);
      where.push(` fc.facultyId IN (${faculty.join(',')})  `);
    }

    if (semester && semester.length) {
      where.push(` s.semesterId IN (${semester.join(',')}) `);
    }

    if (student && student.length) {
      where.push(` sc.studentId IN (${student.join(',')}) `);
    }

    let query = ``;

    if (userTypeCode === 'STUDENT') {
      query = `
      SELECT 
      c.courseId,
      c.title,
      c.description,
      c.semesterId,
      c.isPublished,
  
      s.semesterId,
      s.semesterName,
      s.semesterDuration
     
      FROM course c
  
      LEFT JOIN semester s ON c.semesterId = s.semesterId
  
      LEFT JOIN studentcourse sc ON sc.courseId = c.courseId
      LEFT JOIN users u on u.userId = sc.studentId
  
      WHERE ${where.join(' AND ')}
  
      GROUP BY c.courseId `;
    } else {
      query = `
      SELECT 
      c.courseId,
      c.title,
      c.description,
      c.semesterId,
      c.isPublished,
  
      s.semesterId,
      s.semesterName,
      s.semesterDuration,
  
      (
        SELECT GROUP_CONCAT(u.name SEPARATOR ', ')
        FROM users u
        JOIN facultycourse fc ON u.userId = fc.facultyId
        WHERE ${subQueryWhere.join(' AND ')}
      ) AS facultyNames
     
      FROM course c
  
      LEFT JOIN semester s ON c.semesterId = s.semesterId
  
      LEFT JOIN facultycourse fc ON fc.courseId = c.courseId
      LEFT JOIN users u on u.userId = fc.facultyId
  
      WHERE ${where.join(' AND ')}
  
      GROUP BY c.courseId `;
    }

    let list = await db.customQuery(query);

    res.json(list);
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.put('/course/:id', async function (req, res, next) {
  const { id: courseId } = req.params;
  try {
    let data = {
      description: req.body.description,
    };

    let where = {
      courseId,
    };

    let updatedCourse = await db.updateRecord('course', data, where);

    res.json({ course: updatedCourse, success: true });
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.get('/course/:id', async function (req, res, next) {
  try {
    const { id: courseId } = req.params;
    let where = [`c.courseId = ${courseId} `];

    let query = `
      SELECT 
      c.courseId,
      c.title,
      c.description,
      c.semesterId,
      c.isPublished,

      s.semesterId,
      s.semesterName,
      s.semesterDuration,

      (
        SELECT GROUP_CONCAT(u.name SEPARATOR ', ')
        FROM users u
        JOIN facultycourse fc ON u.userId = fc.facultyId
      ) AS facultyNames,

      (
        SELECT COUNT(*)
        FROM facultycourse fc
        WHERE fc.courseId = ${courseId}
        
        GROUP BY fc.courseId
      ) AS totalFaculties,

      (
        SELECT COUNT(*)
        FROM studentcourse sc
        WHERE sc.courseId = ${courseId}
        GROUP BY sc.courseId
      ) AS totalStudents

    
      FROM course c

      LEFT JOIN semester s ON c.semesterId = s.semesterId

      LEFT JOIN facultycourse fc ON fc.courseId = c.courseId
      LEFT JOIN users u on u.userId = fc.facultyId

      WHERE ${where.join(' AND ')}

      GROUP BY c.courseId

  `;

    let course = await db.customQuery(query);
    if (course && course.length) {
      res.json(course[0]);
    } else {
      res.json({});
    }
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.post('/add-user-to-course', async function (req, res, next) {
  try {
    console.log(req.body);
    const { userId = [], type = null, courseId } = req.body;

    let tableName = type === 'student' ? 'studentcourse' : 'facultycourse';

    // Construct the values string for multiple insert
    let values = userId.map(id => `(${id}, ${courseId})`).join(', ');

    let query = `INSERT INTO ${tableName} (${type === 'student' ? 'studentId' : 'facultyId'}, courseId) VALUES ${values};`;

    let list = await db.customQuery(query);

    res.json(list);
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.get('/student-by-course/:id', async function (req, res, next) {
  try {
    const { id: courseId = null } = req.params;
    const { includeStudent = 'no' } = req.query;

    let query = `
    SELECT
      u.userId,
      u.name,
      u.email

    FROM users u

    WHERE u.userId ${includeStudent === 'yes' ? 'NOT IN' : 'IN'} (
        SELECT sc.studentId 
        FROM studentcourse sc 
        WHERE sc.courseId = ${courseId} 
      ) AND u.userType = 3


    ORDER BY u.name

  `;

    let list = await db.customQuery(query);

    res.json(list);
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

router.get('/faculty-by-course/:id', async function (req, res, next) {
  try {
    const { id: courseId = null } = req.params;
    const { includeFaculty = 'no' } = req.query;

    let query = `
    SELECT
      u.userId,
      u.name,
      u.email

    FROM users u

    WHERE u.userId ${includeFaculty === 'yes' ? 'NOT IN' : 'IN'} (
        SELECT fc.facultyId 
        FROM facultycourse fc 
        WHERE fc.courseId = ${courseId} 
      ) AND u.userType = 2


    ORDER BY u.name

  `;

    let list = await db.customQuery(query);

    res.json(list);
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

// Other
router.get('/faculty', async function (req, res, next) {
  try {
    let where = {
      userType: 2,
    };

    let list = await db.getRecords('users', where);
    res.json(list);
  } catch (error) {
    res.json(error);
  }
});

router.get('/semester', async function (req, res, next) {
  try {
    let list = await db.getRecords('semester', null);
    res.json(list);
  } catch (error) {
    res.json(error);
  }
});

router.put('/update-content', async function (req, res, next) {
  const { id, type, description } = req.body;
  try {
    let data = {
      description: description,
    };

    let where = {};

    if (type === 'assignment') {
      where = {
        assignmentId: id,
      };
    } else {
      where = {
        quizId: id,
      };
    }

    let updatedCourse = await db.updateRecord(type, data, where);

    res.json({ course: updatedCourse, success: true });
  } catch (error) {
    console.log('ERROR: ', error);
    res.json(error);
  }
});

module.exports = router;
