'use client';
import { Button, Flex, Table, Modal, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import type { PermissionItem } from '../../../interface/permission';
import { getPermissions } from '../../../api/permission';

const { confirm } = Modal;

const columns: ColumnsType<PermissionItem> = [
  {
    title: '번호',
    dataIndex: 'no',
    width: 80,
  },
  {
    title: '권한명',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '설명',
    dataIndex: 'description',
  },
  {
    title: '최종 수정일',
    dataIndex: 'updatedAt',
    width: 180,
    render: (date: Date) => format(date, 'yyyy-MM-dd hh:mm:ss'),
  },
  {
    title: '',
    width: 80,
    render: (value: any) => {
      return (
        <Link href={`/permission/edit/${(value as any).no}`}>
          <Button size="small" type="text">
            <EditOutlined />
          </Button>
        </Link>
      );
    },
  },
];

export default function PermissionList() {
  const [data, setData] = useState<PermissionItem[]>([]);
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<PermissionItem[]>([]);

  const fetchData = useCallback(async ({ page, count }) => {
    const permissions = await getPermissions({ page, count });
    setData(permissions.data);
    // setTotal(permissions.data.total);
  }, []);

  useEffect(() => {
    setPage(1);
    void fetchData({ page, count });
  }, [page, count, fetchData]);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '권한 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 권한을 삭제하시겠습니까?',
      onOk() {
        void message.success('선택된 권한이 삭제됐습니다.');
      },
    });
  }, []);

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: PermissionItem[],
    ) => {
      setSelectedData(selectedRows);
    },
  };

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="small" align="center">
          <Button
            danger
            disabled={data.length === 0 || selectedData.length === 0}
            onClick={onClickDelete}
          >
            삭제
          </Button>
          <Link href="/permission/register">
            <Button type="primary">등록</Button>
          </Link>

          <span>Total : {count}</span>
        </Flex>
      </Flex>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 750 }}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    </Flex>
  );
}
