declare global {
    interface LmsClass {
        id: number
        title: string
        description?: string
        visibility: string
        code?: string
        creator: User
        member_count: number
        memberships: Membersift[] | []
        lessons: Lessons[] | []
        created_at: Date | string
        updated_at?: Date | string

        // fe only
        color?: string 
    }

    interface CreateMemberClassCode {
        code: string
    }

    interface CreateLmsClass {
        title: string
        description?: string
    }

    interface Membersift {
        id: number,
        is_active: boolean,
        joined_at: string,
        role: string
        user: User
    }

    interface Lessons {
        id: number,
        class_id: number
        title: string,
        summary: string
        content: any
        content_json: any
        author_id: any,
        is_published: boolean
    }
}
export {}