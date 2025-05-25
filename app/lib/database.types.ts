export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					profile_id: string;
					name: string;
					bio: string | null;
					language: string[];
					interests: string[] | null;
					location: string | null;
					is_host: boolean;
					avatar_url: string | null;
					marketing_consent: boolean;
					role: "traveler" | "local_host" | "admin";
					status: "active" | "inactive" | "banned";
					created_at: string;
					updated_at: string;
				};
				Insert: {
					profile_id: string;
					name: string;
					bio?: string | null;
					language?: string[];
					interests?: string[] | null;
					location?: string | null;
					is_host?: boolean;
					avatar_url?: string | null;
					marketing_consent?: boolean;
					role: "traveler" | "local_host" | "admin";
					status?: "active" | "inactive" | "banned";
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					profile_id?: string;
					name?: string;
					bio?: string | null;
					language?: string[];
					interests?: string[] | null;
					location?: string | null;
					is_host?: boolean;
					avatar_url?: string | null;
					marketing_consent?: boolean;
					role?: "traveler" | "local_host" | "admin";
					status?: "active" | "inactive" | "banned";
					created_at?: string;
					updated_at?: string;
				};
			};
			matches: {
				Row: {
					id: string;
					userId1: string;
					userId2: string;
					initiatorId: string;
					status: "pending" | "accepted" | "declined" | "unmatched";
					matchedAt: string | null;
					location: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					userId1: string;
					userId2: string;
					initiatorId: string;
					status?: "pending" | "accepted" | "declined" | "unmatched";
					matchedAt?: string | null;
					location?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					userId1?: string;
					userId2?: string;
					initiatorId?: string;
					status?: "pending" | "accepted" | "declined" | "unmatched";
					matchedAt?: string | null;
					location?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			chats: {
				Row: {
					id: string;
					matchId: string;
					senderId: string;
					content: string;
					messageType: "text" | "system" | "location";
					created_at: string;
					readAt: string | null;
				};
				Insert: {
					id?: string;
					matchId: string;
					senderId: string;
					content: string;
					messageType?: "text" | "system" | "location";
					created_at?: string;
					readAt?: string | null;
				};
				Update: {
					id?: string;
					matchId?: string;
					senderId?: string;
					content?: string;
					messageType?: "text" | "system" | "location";
					created_at?: string;
					readAt?: string | null;
				};
			};
			meetups: {
				Row: {
					id: string;
					matchId: string;
					proposedById: string;
					proposedTime: string | null;
					proposedLocation: string | null;
					status:
						| "proposed"
						| "confirmed"
						| "declined"
						| "completed"
						| "cancelled";
					confirmedAt: string | null;
					feedbackWritten: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					matchId: string;
					proposedById: string;
					proposedTime?: string | null;
					proposedLocation?: string | null;
					status?:
						| "proposed"
						| "confirmed"
						| "declined"
						| "completed"
						| "cancelled";
					confirmedAt?: string | null;
					feedbackWritten?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					matchId?: string;
					proposedById?: string;
					proposedTime?: string | null;
					proposedLocation?: string | null;
					status?:
						| "proposed"
						| "confirmed"
						| "declined"
						| "completed"
						| "cancelled";
					confirmedAt?: string | null;
					feedbackWritten?: boolean;
					created_at?: string;
				};
			};
			feedbacks: {
				Row: {
					id: string;
					meetupId: string;
					writerId: string;
					rating: number;
					comment: string | null;
					emotionTag:
						| "warm"
						| "fun"
						| "awkward"
						| "disappointing"
						| null;
					created_at: string;
				};
				Insert: {
					id?: string;
					meetupId: string;
					writerId: string;
					rating: number;
					comment?: string | null;
					emotionTag?:
						| "warm"
						| "fun"
						| "awkward"
						| "disappointing"
						| null;
					created_at?: string;
				};
				Update: {
					id?: string;
					meetupId?: string;
					writerId?: string;
					rating?: number;
					comment?: string | null;
					emotionTag?:
						| "warm"
						| "fun"
						| "awkward"
						| "disappointing"
						| null;
					created_at?: string;
				};
			};
			stories: {
				Row: {
					id: string;
					userId: string;
					title: string;
					content: string;
					location: string | null;
					matchedUserNickname: string | null;
					imageUrl: string | null;
					isPublic: boolean;
					likes: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					userId: string;
					title: string;
					content: string;
					location?: string | null;
					matchedUserNickname?: string | null;
					imageUrl?: string | null;
					isPublic?: boolean;
					likes?: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					userId?: string;
					title?: string;
					content?: string;
					location?: string | null;
					matchedUserNickname?: string | null;
					imageUrl?: string | null;
					isPublic?: boolean;
					likes?: number;
					created_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
}
