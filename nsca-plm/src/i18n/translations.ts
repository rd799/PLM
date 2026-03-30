export type Lang = 'vi' | 'en';

export const t: Record<string, Record<Lang, string>> = {
  // App
  appName: { vi: 'NSCA PLM', en: 'NSCA PLM' },
  appDesc: { vi: 'Hệ thống Ban hành & Quản lý Sản phẩm', en: 'Product Publishing & Management System' },
  search: { vi: 'Tìm sản phẩm, vật tư, bản vẽ...', en: 'Search products, materials, drawings...' },

  // Auth
  login: { vi: 'Đăng nhập', en: 'Sign In' },
  email: { vi: 'Email', en: 'Email' },
  password: { vi: 'Mật khẩu', en: 'Password' },
  forgotPassword: { vi: 'Quên mật khẩu?', en: 'Forgot password?' },
  register: { vi: 'Đăng ký', en: 'Sign Up' },
  logout: { vi: 'Đăng xuất', en: 'Sign Out' },

  // Roles
  roleAdmin: { vi: 'Admin', en: 'Admin' },
  roleTpRd: { vi: 'Trưởng phòng R&D', en: 'R&D Manager' },
  roleNvRd: { vi: 'Nhân viên R&D', en: 'R&D Engineer' },
  roleTpSx: { vi: 'Trưởng phòng SX', en: 'Production Manager' },
  roleNvSx: { vi: 'Nhân viên SX', en: 'Production Staff' },
  roleTpKcs: { vi: 'Trưởng KCS', en: 'QC Manager' },
  roleNvKcs: { vi: 'Nhân viên KCS', en: 'QC Staff' },
  rolePublic: { vi: 'Kinh doanh / NPP', en: 'Sales / Distributor' },

  // Nav - Product Tree
  productTree: { vi: 'Cây sản phẩm', en: 'Product Tree' },
  addProduct: { vi: '+ SP', en: '+ Product' },

  // Nav - Modules
  modules: { vi: 'Modules', en: 'Modules' },
  dashboard: { vi: 'Dashboard', en: 'Dashboard' },
  overview: { vi: 'Tổng quan', en: 'Overview' },
  techSpecs: { vi: 'Thông số KT', en: 'Tech Specs' },
  drawingsDocs: { vi: 'Bản vẽ & Tài liệu', en: 'Drawings & Docs' },
  productionProcess: { vi: 'Quy trình SX', en: 'Production Process' },
  bom: { vi: 'BOM Vật tư', en: 'BOM' },
  workInstructions: { vi: 'Hướng dẫn CN', en: 'Work Instructions' },
  qcStandards: { vi: 'Tiêu chuẩn CL', en: 'QC Standards' },
  hvacCalc: { vi: 'HVAC Calculator', en: 'HVAC Calculator' },
  media: { vi: 'Media', en: 'Media' },
  catalogExport: { vi: 'Catalog / Xuất PDF', en: 'Catalog / Export' },
  feedback: { vi: 'Góp ý', en: 'Feedback' },
  userMgmt: { vi: 'Quản lý User', en: 'User Management' },

  // Lifecycle
  concept: { vi: 'Ý tưởng', en: 'Concept' },
  design: { vi: 'Thiết kế', en: 'Design' },
  prototype: { vi: 'Mẫu thử', en: 'Prototype' },
  validation: { vi: 'Đánh giá', en: 'Validation' },
  preProd: { vi: 'SX thử', en: 'Pre-Prod' },
  production: { vi: 'Sản xuất', en: 'Production' },
  obsolete: { vi: 'Ngưng SX', en: 'Obsolete' },

  // Status
  draft: { vi: 'Nháp', en: 'Draft' },
  pendingApproval: { vi: 'Chờ duyệt', en: 'Pending' },
  rejected: { vi: 'Từ chối', en: 'Rejected' },
  published: { vi: 'Đã ban hành', en: 'Published' },
  sxConfirmed: { vi: 'SX đã xác nhận', en: 'SX Confirmed' },
  kcsConfirmed: { vi: 'KCS đã xác nhận', en: 'QC Confirmed' },
  notFilled: { vi: 'Chưa bổ sung', en: 'Not filled' },
  incomplete: { vi: 'Chưa hoàn chỉnh', en: 'Incomplete' },
  complete: { vi: 'Hoàn chỉnh', en: 'Complete' },

  // Actions
  save: { vi: 'Lưu', en: 'Save' },
  edit: { vi: 'Sửa', en: 'Edit' },
  delete: { vi: 'Xóa', en: 'Delete' },
  cancel: { vi: 'Hủy', en: 'Cancel' },
  confirm: { vi: 'Xác nhận', en: 'Confirm' },
  submitForApproval: { vi: 'Gửi duyệt', en: 'Submit for Approval' },
  approve: { vi: 'Duyệt', en: 'Approve' },
  reject: { vi: 'Từ chối', en: 'Reject' },
  publish: { vi: 'Ban hành', en: 'Publish' },
  viewChanges: { vi: 'Xem thay đổi', en: 'View Changes' },
  clone: { vi: 'Sao chép SP', en: 'Clone Product' },
  exportPdf: { vi: 'Xuất PDF', en: 'Export PDF' },
  import: { vi: 'Import', en: 'Import' },
  export: { vi: 'Export', en: 'Export' },

  // Sections
  basicInfo: { vi: 'Thông tin cơ bản', en: 'Basic Information' },
  description: { vi: 'Mô tả', en: 'Description' },
  publicDesc: { vi: 'Mô tả Public', en: 'Public Description' },
  internalNotes: { vi: 'Ghi chú nội bộ', en: 'Internal Notes' },
  dimensions: { vi: 'Kích thước', en: 'Dimensions' },
  certifications: { vi: 'Chứng nhận', en: 'Certifications' },
  mainMaterials: { vi: 'Vật tư chính', en: 'Main Materials' },
  components: { vi: 'Linh kiện', en: 'Components' },
  consumables: { vi: 'Tiêu hao', en: 'Consumables' },
  packaging: { vi: 'Đóng gói', en: 'Packaging' },

  // Doc scopes
  rdOnly: { vi: 'R&D only', en: 'R&D only' },
  internal: { vi: 'Nội bộ', en: 'Internal' },
  public: { vi: 'Public', en: 'Public' },

  // Health
  healthScore: { vi: 'Điểm hoàn chỉnh', en: 'Health Score' },
  missingItems: { vi: 'Hạng mục chưa bổ sung', en: 'Missing Items' },
  recentActivity: { vi: 'Hoạt động gần đây', en: 'Recent Activity' },
  pendingConfirmation: { vi: 'Chờ xác nhận', en: 'Pending Confirmation' },
  newPublished: { vi: 'Mới ban hành', en: 'Newly Published' },
};

export function useT(key: string, lang: Lang): string {
  return t[key]?.[lang] || key;
}
