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
                }
            }
        }
    }
}

export type CaseStudy = Database['public']['Tables']['case_studies']['Row'];
export type CaseStudyInsert = Database['public']['Tables']['case_studies']['Insert'];
export type CaseStudyUpdate = Database['public']['Tables']['case_studies']['Update'];

export type SelectedWork = Database['public']['Tables']['selected_works']['Row'];
export type SelectedWorkInsert = Database['public']['Tables']['selected_works']['Insert'];
export type SelectedWorkUpdate = Database['public']['Tables']['selected_works']['Update'];
