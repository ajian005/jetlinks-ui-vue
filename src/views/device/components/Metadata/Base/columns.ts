import { ColumnProps } from "ant-design-vue/es/table";
import createI18n from "@/locales/index"
const t = createI18n.global.t
const SourceMap = {
  device: t('Metadata.Base.columns.device'),
  manual: t('Metadata.Base.columns.manual'),
  rule: t('Metadata.Base.columns.ruls'),
};

const type = {
  read: t('Metadata.Base.columns.read'),
  write: t('Metadata.Base.columns.write'),
  report: t('Metadata.Base.columns.report'),
};

const BaseColumns: ColumnProps[] = [
  {
    title: t('Metadata.Base.columns.id'),
    dataIndex: 'id',
    width: 100
  },
  {
    title: t('Metadata.Base.columns.name'),
    dataIndex: 'name',
    width: 200
  },
  {
    title: t('Metadata.Base.columns.description'),
    dataIndex: 'description',
    width: 200
  },
];

const EventColumns: ColumnProps[] = BaseColumns.concat([
  {
    title: t('Metadata.Base.columns.level'),
    dataIndex: 'level',
  },
]);

const FunctionColumns: ColumnProps[] = BaseColumns.concat([
  {
    title: t('Metadata.Base.columns.async'),
    dataIndex: 'async',
  },
  // {
  //   title: '读写类型',
  //   dataIndex: 'expands',
  //   render: (text: any) => (text?.type || []).map((item: string | number) => <Tag>{type[item]}</Tag>),
  // },
]);

const PropertyColumns: ColumnProps[] = BaseColumns.concat([
  {
    title: t('Metadata.Base.columns.valueType'),
    dataIndex: 'valueType',
  },
  {
    title: t('Metadata.Base.columns.source'),
    dataIndex: 'source',
  },
  {
    title: t('Metadata.Base.columns.type'),
    dataIndex: 'type',
  },
]);

const TagColumns: ColumnProps[] = BaseColumns.concat([
  {
    title: t('Metadata.Base.columns.valueType'),
    dataIndex: 'valueType',
  },
  {
    title: t('Metadata.Base.columns.type'),
    dataIndex: 'type',
  },
]);

const MetadataMapping = new Map<string, ColumnProps[]>();
MetadataMapping.set('properties', PropertyColumns);
MetadataMapping.set('events', EventColumns);
MetadataMapping.set('tags', TagColumns);
MetadataMapping.set('functions', FunctionColumns);

export default MetadataMapping;