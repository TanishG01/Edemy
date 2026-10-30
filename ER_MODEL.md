# LMS Entity-Relationship Model

This diagram models the MongoDB entities used by the backend, including embedded structures and cross-entity references.

```mermaid
erDiagram
    USER {
        string _id PK "Clerk user id"
        string name
        string email
        string imageUrl
        datetime createdAt
        datetime updatedAt
    }

    COURSE {
        objectId _id PK
        string courseTitle
        string courseDescription
        string courseThumbnail
        number coursePrice
        boolean isPublished
        number discount
        string educator FK "-> USER._id"
        datetime createdAt
        datetime updatedAt
    }

    CHAPTER {
        string chapterId PK
        number chapterOrder
        string chapterTitle
    }

    LECTURE {
        string lectureId PK
        string lectureTitle
        number lectureDuration
        string lectureUrl
        boolean isPreviewFree
        number lectureOrder
    }

    COURSE_RATING {
        string userId FK "-> USER._id"
        number rating "1..5"
    }

    PURCHASE {
        objectId _id PK
        objectId courseId FK "-> COURSE._id"
        string userId FK "-> USER._id"
        number amount
        string status "pending|completed|failed"
        datetime createdAt
        datetime updatedAt
    }

    COURSE_PROGRESS {
        objectId _id PK
        string userId FK "-> USER._id"
        string courseId FK "logical -> COURSE._id"
        boolean completed
    }

    LECTURE_PROGRESS {
        string lectureId FK "-> LECTURE.lectureId"
    }

    %% Main ownership and enrollment
    USER ||--o{ COURSE : creates_as_educator
    USER }o--o{ COURSE : enrolls_in

    %% Payment and purchase history
    USER ||--o{ PURCHASE : makes
    COURSE ||--o{ PURCHASE : is_purchased_via

    %% Ratings
    COURSE ||--o{ COURSE_RATING : receives
    USER ||--o{ COURSE_RATING : gives

    %% Content structure (embedded in Course)
    COURSE ||--o{ CHAPTER : contains
    CHAPTER ||--o{ LECTURE : contains

    %% Learning progress
    USER ||--o{ COURSE_PROGRESS : tracks
    COURSE ||--o{ COURSE_PROGRESS : tracked_by
    COURSE_PROGRESS ||--o{ LECTURE_PROGRESS : marks_completed
```

## Notes

- `USER.enrolledCourses` stores an array of `Course._id` values.
- `COURSE.enrolledStudents` stores an array of `User._id` values.
- `COURSE.educator` references `User._id` (string, aligned with Clerk user id).
- `COURSE.courseContent` is embedded course structure represented by `CHAPTER` and `LECTURE` in the diagram.
- `COURSE.courseRatings` is an embedded array represented by `COURSE_RATING` in the diagram.
- `COURSE_PROGRESS.courseId` is stored as string in schema, but used logically as a reference to `COURSE._id`.
- `COURSE_PROGRESS.lectureCompleted` is represented by `LECTURE_PROGRESS` as a logical list of completed lecture ids.
