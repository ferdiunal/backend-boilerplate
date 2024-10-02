import type {
  AuthMFAEnrollResponse,
  User as AccountType,
} from "@supabase/supabase-js";
import type { AuthRole } from "./auth.enum";
import { string } from "zod";

export type AuthMFAEnrollResponseTOTP = Extract<
  AuthMFAEnrollResponse,
  { data: { type: "totp" } }
>["data"];

export type GenderType = "male" | "female" | "other";

export type User = {
  id: string;
  id_number?: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  gender?: GenderType | null;
  birth_date?: string;
  nationality?: string;
  role?: AuthRole;
  created_at: Date;
  updated_at: Date;
  account: AccountType;
};

export type UidType = string;
