export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/income/child(.*)": ["child"],
  "/income/creator(.*)": ["creator"],
  "/income/audit(.*)": ["audit"],
  "/income/list/creators": ["admin", "creator"],
  "/income/list/childs": ["admin", "creator"],
  "/income/list/audits": ["admin", "creator"],
  "/income/list/subjects": ["admin"],
  "/income/list/classes": ["admin", "creator"],
  "/income/list/exams": ["admin", "creator", "child", "audit"],
  "/income/list/assignments": ["admin", "creator", "child", "audit"],
  "/income/list/results": ["admin", "creator", "child", "audit"],
  "/income/list/attendance": ["admin", "creator", "child", "audit"],
  "/income/list/events": ["admin", "creator", "child", "audit"],
  "/income/list/announcements": ["admin", "creator", "child", "audit"],


    "/protected/child": ["child", "parent", "admin", "creator"],
    "/protected/parent": ["parent", "admin", "creator"],
    "/protected/admin": ["admin", "creator"],
    "/protected/creator": ["creator"],
  
};