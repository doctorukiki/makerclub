-- 필요한 ENUM 타입들 생성 (이미 존재할 수 있으므로 IF NOT EXISTS 사용)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM('traveler', 'local_host', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM('active', 'inactive', 'banned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assessment_status AS ENUM('in_progress', 'completed', 'abandoned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_category AS ENUM('choice', 'scale');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_status AS ENUM('active', 'inactive', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE message_type AS ENUM('text', 'system', 'location');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE meetup_status AS ENUM('proposed', 'confirmed', 'declined', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE match_status AS ENUM('pending', 'accepted', 'declined', 'unmatched');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE profile_visibility AS ENUM('public', 'hidden');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE emotion_tag AS ENUM('warm', 'fun', 'awkward', 'disappointing');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- profiles 테이블 생성
CREATE TABLE IF NOT EXISTS profiles (
    profile_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    bio text,
    language jsonb DEFAULT '["korean"]' NOT NULL,
    interests jsonb,
    location varchar(100),
    is_host boolean DEFAULT false NOT NULL,
    avatar_url text,
    marketing_consent boolean DEFAULT false NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- profiles 테이블 정책들
DROP POLICY IF EXISTS "select-profile-policy" ON profiles;
CREATE POLICY "select-profile-policy" ON profiles 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "edit-profile-policy" ON profiles;
CREATE POLICY "edit-profile-policy" ON profiles 
    AS PERMISSIVE FOR UPDATE TO authenticated 
    USING (auth.uid() = profile_id) 
    WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "delete-profile-policy" ON profiles;
CREATE POLICY "delete-profile-policy" ON profiles 
    AS PERMISSIVE FOR DELETE TO authenticated 
    USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "insert-profile-policy" ON profiles;
CREATE POLICY "insert-profile-policy" ON profiles 
    AS PERMISSIVE FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = profile_id);

-- questions 테이블 생성
CREATE TABLE IF NOT EXISTS questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_number integer NOT NULL UNIQUE,
    category question_category NOT NULL,
    question_text text NOT NULL,
    options jsonb,
    left_emoji text,
    right_emoji text,
    personality_dimensions jsonb,
    status question_status DEFAULT 'active' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- personality_assessments 테이블 생성
CREATE TABLE IF NOT EXISTS personality_assessments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    status assessment_status DEFAULT 'in_progress' NOT NULL,
    choice_answers jsonb DEFAULT '{}' NOT NULL,
    scale_answers jsonb DEFAULT '{}' NOT NULL,
    personality_traits jsonb,
    mbti_type text,
    primary_traits jsonb,
    description text,
    recommended_activities jsonb,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- personality_assessments RLS 활성화
ALTER TABLE personality_assessments ENABLE ROW LEVEL SECURITY;

-- personality_assessments 정책들
DROP POLICY IF EXISTS "select-assessment-policy" ON personality_assessments;
CREATE POLICY "select-assessment-policy" ON personality_assessments 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "update-assessment-policy" ON personality_assessments;
CREATE POLICY "update-assessment-policy" ON personality_assessments 
    AS PERMISSIVE FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete-assessment-policy" ON personality_assessments;
CREATE POLICY "delete-assessment-policy" ON personality_assessments 
    AS PERMISSIVE FOR DELETE TO authenticated 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert-assessment-policy" ON personality_assessments;
CREATE POLICY "insert-assessment-policy" ON personality_assessments 
    AS PERMISSIVE FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id);

-- question_answers 테이블 생성
CREATE TABLE IF NOT EXISTS question_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id uuid NOT NULL REFERENCES personality_assessments(id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES questions(id),
    question_number integer NOT NULL,
    answer_value integer NOT NULL,
    answered_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- question_answers RLS 활성화
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;

-- question_answers 정책
DROP POLICY IF EXISTS "select-answer-policy" ON question_answers;
CREATE POLICY "select-answer-policy" ON question_answers 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM personality_assessments 
            WHERE personality_assessments.id = question_answers.assessment_id 
            AND personality_assessments.user_id = auth.uid()
        )
    );

-- compatibility_scores 테이블 생성
CREATE TABLE IF NOT EXISTS compatibility_scores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id uuid NOT NULL REFERENCES profiles(profile_id),
    user2_id uuid NOT NULL REFERENCES profiles(profile_id),
    overall_score integer NOT NULL,
    trait_scores jsonb NOT NULL,
    calculated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- compatibility_scores RLS 활성화
ALTER TABLE compatibility_scores ENABLE ROW LEVEL SECURITY;

-- compatibility_scores 정책
DROP POLICY IF EXISTS "select-compatibility-policy" ON compatibility_scores;
CREATE POLICY "select-compatibility-policy" ON compatibility_scores 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- matches 테이블 생성
CREATE TABLE IF NOT EXISTS matches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id_1 uuid NOT NULL REFERENCES profiles(profile_id),
    user_id_2 uuid NOT NULL REFERENCES profiles(profile_id),
    initiator_id uuid NOT NULL REFERENCES profiles(profile_id),
    status match_status DEFAULT 'pending',
    matched_at timestamp with time zone,
    location varchar(100),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(user_id_1, user_id_2)
);

-- matches RLS 활성화
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- matches 정책들
DROP POLICY IF EXISTS "select-match-policy" ON matches;
CREATE POLICY "select-match-policy" ON matches 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

DROP POLICY IF EXISTS "insert-match-policy" ON matches;
CREATE POLICY "insert-match-policy" ON matches 
    AS PERMISSIVE FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = initiator_id);

DROP POLICY IF EXISTS "update-match-policy" ON matches;
CREATE POLICY "update-match-policy" ON matches 
    AS PERMISSIVE FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- meetups 테이블 생성
CREATE TABLE IF NOT EXISTS meetups (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id uuid NOT NULL REFERENCES matches(id),
    proposed_by_id uuid NOT NULL REFERENCES profiles(profile_id),
    proposed_time timestamp with time zone,
    proposed_location varchar(255),
    status meetup_status DEFAULT 'proposed',
    confirmed_at timestamp with time zone,
    feedback_written boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- meetups RLS 활성화
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;

-- meetups 정책들
DROP POLICY IF EXISTS "select-meetup-policy" ON meetups;
CREATE POLICY "select-meetup-policy" ON meetups 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = meetups.match_id 
            AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
        )
    );

DROP POLICY IF EXISTS "insert-meetup-policy" ON meetups;
CREATE POLICY "insert-meetup-policy" ON meetups 
    AS PERMISSIVE FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = proposed_by_id);

DROP POLICY IF EXISTS "update-meetup-policy" ON meetups;
CREATE POLICY "update-meetup-policy" ON meetups 
    AS PERMISSIVE FOR UPDATE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = meetups.match_id 
            AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
        )
    );

-- chats 테이블 생성
CREATE TABLE IF NOT EXISTS chats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id uuid NOT NULL REFERENCES matches(id),
    sender_id uuid NOT NULL REFERENCES profiles(profile_id),
    content text NOT NULL,
    message_type message_type DEFAULT 'text',
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- chats RLS 활성화
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- chats 정책들
DROP POLICY IF EXISTS "select-chat-policy" ON chats;
CREATE POLICY "select-chat-policy" ON chats 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = chats.match_id 
            AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
        )
    );

DROP POLICY IF EXISTS "insert-chat-policy" ON chats;
CREATE POLICY "insert-chat-policy" ON chats 
    AS PERMISSIVE FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "update-chat-policy" ON chats;
CREATE POLICY "update-chat-policy" ON chats 
    AS PERMISSIVE FOR UPDATE TO authenticated 
    USING (auth.uid() = sender_id);

-- feedbacks 테이블 생성
CREATE TABLE IF NOT EXISTS feedbacks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    meetup_id uuid NOT NULL REFERENCES meetups(id),
    writer_id uuid NOT NULL REFERENCES profiles(profile_id),
    rating integer NOT NULL, -- 1 to 5
    comment text,
    emotion_tag emotion_tag,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(meetup_id, writer_id)
);

-- feedbacks RLS 활성화
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- feedbacks 정책들
DROP POLICY IF EXISTS "select-feedback-policy" ON feedbacks;
CREATE POLICY "select-feedback-policy" ON feedbacks 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (
        auth.uid() = writer_id OR
        EXISTS (
            SELECT 1 FROM meetups 
            JOIN matches ON matches.id = meetups.match_id
            WHERE meetups.id = feedbacks.meetup_id 
            AND (matches.user_id_1 = auth.uid() OR matches.user_id_2 = auth.uid())
        )
    );

DROP POLICY IF EXISTS "insert-feedback-policy" ON feedbacks;
CREATE POLICY "insert-feedback-policy" ON feedbacks 
    AS PERMISSIVE FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = writer_id);

DROP POLICY IF EXISTS "update-feedback-policy" ON feedbacks;
CREATE POLICY "update-feedback-policy" ON feedbacks 
    AS PERMISSIVE FOR UPDATE TO authenticated 
    USING (auth.uid() = writer_id);

-- payments 테이블 생성
CREATE TABLE IF NOT EXISTS payments (
    payment_id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    payment_key text NOT NULL,
    order_id text NOT NULL,
    order_name text NOT NULL,
    total_amount double precision NOT NULL,
    metadata jsonb NOT NULL,
    raw_data jsonb NOT NULL,
    receipt_url text NOT NULL,
    status text NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    approved_at timestamp NOT NULL,
    requested_at timestamp NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- payments RLS 활성화
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- payments 정책
DROP POLICY IF EXISTS "select-payment-policy" ON payments;
CREATE POLICY "select-payment-policy" ON payments 
    AS PERMISSIVE FOR SELECT TO authenticated 
    USING (auth.uid() = user_id);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_personality_assessments_user_id ON personality_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_personality_assessments_status ON personality_assessments(status);
CREATE INDEX IF NOT EXISTS idx_matches_user_id_1 ON matches(user_id_1);
CREATE INDEX IF NOT EXISTS idx_matches_user_id_2 ON matches(user_id_2);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_chats_match_id ON chats(match_id);
CREATE INDEX IF NOT EXISTS idx_chats_sender_id ON chats(sender_id);
CREATE INDEX IF NOT EXISTS idx_meetups_match_id ON meetups(match_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_meetup_id ON feedbacks(meetup_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_personality_assessments_updated_at ON personality_assessments;
CREATE TRIGGER update_personality_assessments_updated_at 
    BEFORE UPDATE ON personality_assessments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at 
    BEFORE UPDATE ON matches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meetups_updated_at ON meetups;
CREATE TRIGGER update_meetups_updated_at 
    BEFORE UPDATE ON meetups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chats_updated_at ON chats;
CREATE TRIGGER update_chats_updated_at 
    BEFORE UPDATE ON chats 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feedbacks_updated_at ON feedbacks;
CREATE TRIGGER update_feedbacks_updated_at 
    BEFORE UPDATE ON feedbacks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 