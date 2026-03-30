export type Role = 'admin' | 'tp_rd' | 'nv_rd' | 'tp_sx' | 'nv_sx' | 'tp_kcs' | 'nv_kcs' | 'public';

export type AccessLevel = 'rd' | 'sx' | 'public';

export type PublishStatus = 'draft' | 'pending' | 'rejected' | 'published';

export type ConfirmStatus = 'none' | 'sx_confirmed' | 'kcs_confirmed' | 'both_confirmed';

export type LifecycleStage = 'concept' | 'design' | 'prototype' | 'validation' | 'pre_prod' | 'production' | 'obsolete';

export type DocScope = 'rd' | 'sx' | 'public';

export type SpecScope = 'rd' | 'sx' | 'public';

export type SectionKey = 'profile' | 'specs' | 'drawings' | 'process' | 'bom' | 'qc';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  created_at: string;
}

export interface Industry {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  sort_order: number;
}

export interface ProductGroup {
  id: string;
  industry_id: string;
  name: string;
  name_en: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  revision: string;
  series?: string;
  application?: string;
  description_public?: string;
  description_internal?: string;
  main_image?: string;
  industry_id?: string;
  group_id?: string;
  lifecycle_stage: LifecycleStage;
  tags?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  // Section statuses
  profile_status: PublishStatus;
  specs_status: PublishStatus;
  drawings_status: PublishStatus;
  process_status: PublishStatus;
  bom_status: PublishStatus;
  qc_status: PublishStatus;
  // Confirmations
  profile_sx_confirmed: boolean;
  specs_sx_confirmed: boolean;
  drawings_sx_confirmed: boolean;
  process_sx_confirmed: boolean;
  bom_sx_confirmed: boolean;
  qc_kcs_confirmed: boolean;
  // Health
  health_score: number;
}

export interface TechSpec {
  id: string;
  product_id: string;
  name: string;
  value: string;
  unit: string;
  standard?: string;
  scope: SpecScope;
  sort_order: number;
  is_draft: boolean;
}

export interface Drawing {
  id: string;
  product_id: string;
  name: string;
  doc_number: string;
  url: string; // Google Drive link
  revision: string;
  doc_type: 'design' | 'production' | 'machining' | 'jig' | 'assembly' | 'installation' | 'submittal' | 'datasheet' | 'catalog' | 'certificate' | 'guide' | 'other';
  scope: DocScope;
  is_draft: boolean;
  sort_order: number;
}

export interface ProcessStep {
  id: string;
  product_id: string;
  step_number: number;
  name: string;
  description?: string;
  cycle_time_seconds: number;
  setup_time_seconds?: number;
  workers: number;
  worker_level?: string;
  equipment?: string;
  safety_notes?: string;
  x: number;
  y: number;
  width: number;
  is_draft: boolean;
}

export interface ProcessConnection {
  id: string;
  product_id: string;
  from_step_id: string;
  to_step_id: string;
}

export interface WorkInstruction {
  id: string;
  step_id: string;
  product_id: string;
  step_number: number;
  title: string;
  description: string;
  image_url?: string;
  duration_seconds?: number;
  sort_order: number;
}

export interface BomItem {
  id: string;
  product_id: string;
  name: string;
  part_number: string;
  group: 'main' | 'component' | 'consumable' | 'packaging';
  quantity: number;
  unit: string;
  material?: string;
  standard?: string;
  tech_description?: string;
  supplier_name?: string; // R&D only
  supplier_code?: string; // R&D only
  supplier_catalog_url?: string; // R&D only
  drawing_url?: string;
  images?: string[];
  is_draft: boolean;
  sort_order: number;
}

export interface QcCriteria {
  id: string;
  product_id: string;
  name: string;
  method: string;
  target_value: string;
  min_value?: number;
  max_value?: number;
  equipment?: string;
  category: 'incoming' | 'in_process' | 'final';
  standard?: string;
  is_draft: boolean;
  sort_order: number;
}

export interface QcRecord {
  id: string;
  product_id: string;
  criteria_id: string;
  lot_number: string;
  actual_value: string;
  result: 'pass' | 'fail' | 'pending';
  inspector_id: string;
  evidence_urls?: string[];
  note?: string;
  created_at: string;
}

export interface ChangeLog {
  id: string;
  product_id: string;
  section: SectionKey;
  revision_from: string;
  revision_to: string;
  changes: ChangeDetail[];
  reason?: string;
  published_by: string;
  approved_by?: string;
  published_at: string;
}

export interface ChangeDetail {
  field: string;
  old_value: string;
  new_value: string;
  type: 'modified' | 'added' | 'removed';
}

export interface Feedback {
  id: string;
  product_id: string;
  section: SectionKey;
  message: string;
  from_user_id: string;
  from_user_name: string;
  from_role: Role;
  status: 'open' | 'resolved';
  created_at: string;
  resolved_at?: string;
}

export interface ProductTimeline {
  id: string;
  product_id: string;
  action: string;
  section?: SectionKey;
  user_id: string;
  user_name: string;
  details?: string;
  created_at: string;
}

// Health score calculation
export function calcHealthScore(p: Product): number {
  let score = 0;
  const weights = { profile: 10, specs: 15, drawings: 20, process: 20, bom: 20, qc: 15 };
  const sections: SectionKey[] = ['profile', 'specs', 'drawings', 'process', 'bom', 'qc'];
  sections.forEach(s => {
    const status = p[`${s}_status` as keyof Product] as PublishStatus;
    if (status === 'published') score += weights[s];
    else if (status === 'pending') score += weights[s] * 0.5;
    else if (status === 'draft') score += weights[s] * 0.2;
  });
  return score;
}

// Role access helpers
export function getRoleAccessLevel(role: Role): AccessLevel {
  if (['admin', 'tp_rd', 'nv_rd'].includes(role)) return 'rd';
  if (['tp_sx', 'nv_sx', 'tp_kcs', 'nv_kcs'].includes(role)) return 'sx';
  return 'public';
}

export function canApprove(role: Role): boolean {
  return ['admin', 'tp_rd'].includes(role);
}

export function canEdit(role: Role): boolean {
  return ['admin', 'tp_rd', 'nv_rd'].includes(role);
}

export function canConfirmSx(role: Role): boolean {
  return ['admin', 'tp_sx'].includes(role);
}

export function canConfirmKcs(role: Role): boolean {
  return ['admin', 'tp_kcs'].includes(role);
}

export function canFillQcRecord(role: Role): boolean {
  return ['admin', 'tp_kcs', 'nv_kcs'].includes(role);
}

export function canSubmitFeedback(role: Role): boolean {
  return ['tp_sx', 'nv_sx', 'tp_kcs', 'nv_kcs', 'public'].includes(role);
}

export const ROLE_LABELS: Record<Role, { vi: string; en: string }> = {
  admin: { vi: 'Admin', en: 'Admin' },
  tp_rd: { vi: 'Trưởng phòng R&D', en: 'R&D Manager' },
  nv_rd: { vi: 'Nhân viên R&D', en: 'R&D Engineer' },
  tp_sx: { vi: 'Trưởng phòng SX', en: 'Production Manager' },
  nv_sx: { vi: 'Nhân viên SX', en: 'Production Staff' },
  tp_kcs: { vi: 'Trưởng KCS', en: 'QC Manager' },
  nv_kcs: { vi: 'Nhân viên KCS', en: 'QC Staff' },
  public: { vi: 'Kinh doanh / NPP', en: 'Sales / Distributor' },
};

export const SECTION_LABELS: Record<SectionKey, { vi: string; en: string; icon: string }> = {
  profile: { vi: 'Sản phẩm', en: 'Product Profile', icon: '📋' },
  specs: { vi: 'Thông số KT', en: 'Tech Specs', icon: '📐' },
  drawings: { vi: 'Bản vẽ & TL', en: 'Drawings & Docs', icon: '📑' },
  process: { vi: 'Quy trình SX', en: 'Production Process', icon: '🏭' },
  bom: { vi: 'BOM Vật tư', en: 'BOM', icon: '📦' },
  qc: { vi: 'Tiêu chuẩn CL', en: 'QC Standards', icon: '✅' },
};
