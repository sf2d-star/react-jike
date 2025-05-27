import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Popconfirm } from 'antd'
//引入汉化包 时间选择器显示中文
//import locale from 'antd/es/date-picker/locale/zh_CN'

//导入资源
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useChannel } from '@/hooks/useChannel'
import { useEffect, useState } from 'react'
import { delArticleAPI, getArticleListAPI } from '@/apis/article'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const navigate = useNavigate()
  const { channelList } = useChannel()
  //准备列数据
  //定义状态枚举
  const status = {
    1: <Tag color='warning'>Pending</Tag>,
    2: <Tag color='success'>Approved</Tag>
  }
  const columns = [
    {
      title: 'Cover',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 220
    },
    {
      title: 'Status',
      dataIndex: 'status',
      //data - 后端返回的状态ststus 根据它做条件渲染
      // data === 1 待审核
      // data === 2 审核通过
      //三元表达式
      //render: data => data === 1 ? <Tag color='warning'>待审核</Tag> : <Tag color='success'>审核通过</Tag>
      render: data => status[data]
    },
    {
      title: 'Pusblish Date',
      dataIndex: 'pubdate'
    },
    {
      title: 'Read',
      dataIndex: 'read_count'
    },
    {
      title: 'Comment',
      dataIndex: 'comment_count'
    },
    {
      title: 'Like',
      dataIndex: 'like_count'
    },
    {
      title: 'Operation',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined onClick={() => navigate(`/publish?id=${data.id}`)}/>} />
            <Popconfirm
              title="Delete the task"
              description="Are you shure to delete this task?"
              onConfirm={() => onConfirm(data)}
              //onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined  />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  //准备表格body数据
  const data = [
    {
      id: '8218',
      comment_count: 0,
      cover: {
        images: [],
      },
      like_count: 0,
      pubdate: '2019-03-11 09:00:00',
      read_count: 2,
      status: 2,
      title: 'wkwebview solution'
    }
  ]

  // 获取文章列表
  //1. 准备参数
    const [ reqData, setReqData ] = useState({
      status: '',
      channel_id: '',
      begin_pubdate: '',
      end_pubdate: '',
      page: 1,
      per_page: 5
    })

  const [ list, setList ] = useState([])
  const [ count, setCount] = useState(0)
  useEffect(() => {
    async function getList() {
      const res = await getArticleListAPI(reqData)
      setList(res.data.data.results)
      setCount(res.data.data.total_count)
    }
    getList()
  }, [reqData])

  // 筛选功能


  //2. 获取当前筛选数据
  const onFinish = (formValue) => {
    console.log(formValue);
    //3. 把表单收集到的数据放到参数中(不可变的方式)
    setReqData({
      ...reqData,
      channel_id: formValue.channel_id,
      status: formValue.status,
      begin_pubdate: formValue.date[0].format('YYYY-MM-DD'),
      end_pubdate: formValue.date[1].format('YYYY-MM-DD')
    })
    //4. 重新拉去文章列表 + 渲染table逻辑重复的 - 复用
    //reqData依赖想发生变化 重复执行副作用函数
  }

  //分页
  const onPageChange = (page) => {
    console.log(page);
    //修改参数依赖想 引发数据的重新获取列表渲染
    setReqData({
      ...reqData,
      page
    })
  }

  //删除
  const onConfirm = async (data) => {
    console.log('删除点击了', data);
    await delArticleAPI(data.id)
    setReqData({
      ...reqData
    })
  }


  return (
    <div>
      <Card
        title={
          <Breadcrumb items={[
            {title: <Link to={'/'}>Home</Link>},
            {title: 'Article List'},
          ]} />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: '' }} onFinish={onFinish}>
          <Form.Item label="Status" name="status">
            <Radio.Group>
              <Radio value={null}>All</Radio>
              <Radio value={0}>Pending</Radio>
              <Radio value={2}>Approved</Radio>
            </Radio.Group>
          </Form.Item>

        <Form.Item label="Channel" name="channel_id">
          <Select
            placeholder="Please choose channel"
            //defaultValue="lucy"
            style={{ width: 250 }}
          >
            {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item label="Date" name="date">
            {/* 传入locale属性 控制中文显示 locale={locale}*/}
            <RangePicker />
        </Form.Item>

        <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
                Filter
            </Button>
        </Form.Item>
      </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`${count} arcticles found: `}>
        <Table rowKey="id" columns={columns} dataSource={list} pagination={{
          total: count,
          pageSize: reqData.per_page,
          onChange: onPageChange
        }} />
      </Card>
    </div>
  )
}

export default Article
