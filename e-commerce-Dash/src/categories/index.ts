import CategoryIcon from "@mui/icons-material/Bookmark";

import CategoryList from "./CategoryList";
import CategoryEdit from "./CategoryEdit";
import CategoryCreate from "./CategoryCreate";
import CategoryShow from "./CategoryShow";

export default {
  list: CategoryList,
  create: CategoryCreate,
  edit: CategoryEdit,
  show: CategoryShow,
  icon: CategoryIcon,
  recordRepresentation: (record: any) => record?.en_name || '',
};

