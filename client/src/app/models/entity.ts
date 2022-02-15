export class Entity {
  id: string;
  name: string;
  tableName: string;
  prefix: string;
  dateCreated: Date;
  entityViews: string;
  linkedForms: string;
}

export class EntityFormFieldMap {
  entityField: string;
  entityFieldType: string;
  formField: string;
  formFieldType: string;
}

export class EntityViews {
  id: string;
  name: string;
  tableName: string;
  description: string;
  dateCreated: Date;
}
