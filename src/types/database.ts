export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// Content block types for rich case study content
export interface RichContentBlock {
    type: 'heading' | 'text' | 'image' | 'video'
    value: string // heading text, paragraph text, image URL, or video URL
    level?: 2 | 3 | 4 // heading level (h2, h3, h4) — only for 'heading' type
}

export interface Database {
    public: {
        /**
         * Empty rather than an index signature. With `{ [key: string]: ... }`
         * here, a table name matches Views as well as Tables, supabase-js can't
         * pick an overload, and `.insert()` resolves its argument to `never` —
         * which is what broke the contact route. This is the shape the Supabase
         * type generator emits for a schema with no views.
         */
        Views: { [_ in never]: never }
        Functions: { [_ in never]: never }
        Enums: { [_ in never]: never }
        CompositeTypes: { [_ in never]: never }
        Tables: {
            case_studies: {
                Row: {
                    id: string
                    created_at: string
                    slug: string
                    title: string
                    category: string
                    description: string
                    image_url: string
                    logo_text: string
                    logo_bg: string
                    badges: Json
                    testimonial_text: string
                    testimonial_author: string
                    testimonial_stars: number
                    testimonial_avatar: string
                    logo_url: string
                    is_featured: boolean
                    year: string
                    timeline: string
                    scope_of_work: string[]
                    content: Json
                }
                Insert: {
                    id?: string
                    created_at?: string
                    slug: string
                    title: string
                    category: string
                    description: string
                    image_url: string
                    logo_text: string
                    logo_bg: string
                    badges: Json
                    testimonial_text: string
                    testimonial_author: string
                    testimonial_stars: number
                    testimonial_avatar: string
                    logo_url?: string
                    is_featured?: boolean
                    year?: string
                    timeline?: string
                    scope_of_work?: string[]
                    content?: Json
                }
                Update: {
                    id?: string
                    created_at?: string
                    slug?: string
                    title?: string
                    category?: string
                    description?: string
                    image_url?: string
                    logo_text?: string
                    logo_bg?: string
                    badges?: Json
                    testimonial_text?: string
                    testimonial_author?: string
                    testimonial_stars?: number
                    testimonial_avatar?: string
                    logo_url?: string
                    is_featured?: boolean
                    year?: string
                    timeline?: string
                    scope_of_work?: string[]
                    content?: Json
                }
                Relationships: []
            }
            messages: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    email: string
                    kind: string
                    company: string | null
                    location: string | null
                    budget: string | null
                    message: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    email: string
                    kind: string
                    company?: string | null
                    location?: string | null
                    budget?: string | null
                    message: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    email?: string
                    kind?: string
                    company?: string | null
                    location?: string | null
                    budget?: string | null
                    message?: string
                }
                Relationships: []
            }
            selected_works: {
                Row: {
                    id: string
                    created_at: string
                    case_study_id: string | null
                    image_url: string
                    title: string
                    category: string
                    display_width: string
                    show_hover_overlay: boolean
                    sort_order: number
                    cover_bg_url: string | null
                    cover_full: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    case_study_id?: string | null
                    image_url: string
                    title: string
                    category: string
                    display_width?: string
                    show_hover_overlay?: boolean
                    sort_order?: number
                    cover_bg_url?: string | null
                    cover_full?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    case_study_id?: string | null
                    image_url?: string
                    title?: string
                    category?: string
                    display_width?: string
                    show_hover_overlay?: boolean
                    sort_order?: number
                    cover_bg_url?: string | null
                    cover_full?: boolean
                }
                /**
                 * Required by postgrest-js's `GenericTable`. Without it the
                 * schema doesn't satisfy `GenericSchema`, the client silently
                 * falls back to its default generic, and every `.insert()`
                 * argument resolves to `never`. Empty is correct — nothing here
                 * is joined through PostgREST; the home page matches
                 * `case_study_id` in application code.
                 */
                Relationships: []
            }
        }
    }
}

export type CaseStudy = Database['public']['Tables']['case_studies']['Row'];
export type CaseStudyInsert = Database['public']['Tables']['case_studies']['Insert'];
export type CaseStudyUpdate = Database['public']['Tables']['case_studies']['Update'];

export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export type SelectedWork = Database['public']['Tables']['selected_works']['Row'];
export type SelectedWorkInsert = Database['public']['Tables']['selected_works']['Insert'];
export type SelectedWorkUpdate = Database['public']['Tables']['selected_works']['Update'];
