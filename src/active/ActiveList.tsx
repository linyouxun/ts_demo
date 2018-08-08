import * as React from 'react';
import ContentHeader from "../components/ContentHeader";
import ActiveFilter from "./components/ActiveFilter";
import FormField from "../components/FormField";
import { Table } from 'antd';

class ActiveList extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.state = {
      activeColumn: [
        {title: 'ID', dataIndex: 'id'},
      ],
      activeList: [],
      loading: false,
      pagination: null
    }
  }
  public onSubmit() {
    console.log('onSubmit');
  }
  public onAdd() {
    this.props.history.push(`/active/list/add`);
  }
  public render(): JSX.Element {
    const {loading, activeList, activeColumn, pagination} = this.state;
    const tableProps = {
      bordered  : true,
      columns   : activeColumn,
      dataSource: activeList,
      loading,
      pagination,
      rowKey    : (record: any, index: number) => {
        return (index + '')
      },
    };
    return (<div className="page">
      <ContentHeader title="活动推广页面配置" />
      <FormField>
        <ActiveFilter onSubmit={this.onSubmit} onAdd={this.onAdd}/>
      </FormField>
      <FormField>
        <Table {...tableProps} />
      </FormField>
    </div>);
  }
}

export default ActiveList;
