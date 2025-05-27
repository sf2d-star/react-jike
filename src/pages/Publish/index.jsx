import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,    // 'Radio' is defined but never used.
  Input,
  Upload,   // 'Upload' is defined but never used.
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { createArticleAPI, getArticleById, updateArticleAPI } from '@/apis/article';
import { useChannel } from '@/hooks/useChannel';
import { useEffect } from 'react';


const { Option } = Select

const Publish = () => {
  //获取频道列表
  const { channelList } = useChannel()

    // 提交表单
    const onFinish = (formValue) => {
      //console.log(formValue);
      // 校验封面类型imageType是否和实际的图片列表imageList数量是相等的
      // 如果相等才允许接口提交
      if(imageList.length !== imageType) {
        return message.warning('封面类型和图片数量不匹配！')
      }
      const { title, content, channel_id } = formValue
      //1. 按接口文档的格式处理收集到的表单数据
      const reqData = {
        title,
        content,
        cover:{
          type: imageType, //封面模式
          //这里的url处理逻辑只是在新增时候的逻辑
          //编辑的时候需要做处理
          images: imageList.map(item => {
            if(item.response) {
              return item.response.data.url
        } else {
          return item.url
        }
        }) //图片列表
        },
        channel_id
      }
      //2. 调用接口提交
      // 处理调用不同的接口  新增 - 新增接口   编辑状态 - 更新接口 id
      if(articleId){
        //更新接口
        updateArticleAPI({...reqData, id: articleId })
      } else {
        //新增接口
        createArticleAPI(reqData)
      }
    }

    //3. 上传回调
    const [imageList, setImageList ] = useState([])
    const onChange = (value) => {
      //console.log('UPLOADING...', value);
      setImageList(value.fileList)
    }

    //切换图片封面类型
    const [imageType, setImageType] = useState(0)
    const onTypeChange = (e) => {
      //console.log('Cover type changed!', e.target.value);
      setImageType(e.target.value)
    }

    // 回填数据
    const [searchParams] = useSearchParams()
    const articleId = searchParams.get('id')
    //console.log(articleId);
    // 获取实例
    const [form] = Form.useForm()
    useEffect(() => {
      //1. 通过id获取数据
      async function getArticleDetail(){
        const res = await getArticleById(articleId)
        const data = res.data.data
        const { cover } = data
        form.setFieldsValue({
          ...data,
          type: data.cover.type
        })
        // 为什么现在的写法无法回填封面？
        //数据结构的问题  set方法 -> { type: 0 1 3 } { cover: { type: 3} }

        // 回填图片列表
        setImageType(cover.type)

        //显示图片（{url:url}）
        setImageList(cover.images.map(url => {
          return { url }
        }))
      }
      // z只有有id的时候才能调用此函数回填
      if(articleId){
        getArticleDetail()
      }
      //2. 调用实例方法 完成回填
    }, [articleId, form])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>Home</Link> },
            { title: `${articleId ? 'Edit' : 'Publish'} article` },
          ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4}}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0}}
          onFinish={onFinish}
          form={form}
        >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please choose article title' }]}
        >
          <Input placeholder="Please choose article title" style={{ width: 400 }} />
          </Form.Item>
        <Form.Item
          label="Channel"
          name="channel_id"
          rules={[{ required: true, message: 'Please choose article channel' }]}
        >
          <Select placeholder="Please choose article channel" style={{ width: 400 }}>
            {/* value属性用户选择之后会自动收集起来作为借口的提交字段 */}
            {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Cover">
          <Form.Item name="type">
            <Radio.Group onChange={onTypeChange}>
              <Radio value={1}>Single</Radio>
              <Radio value={3}>Tripple</Radio>
              <Radio value={0}>None</Radio>
            </Radio.Group>
          </Form.Item>
          {/*
            listType: 决定选择文件框的外观样式
            showUploadList: 控制显示上传列表
          */}
          {imageType > 0 && <Upload
            listType='picture-card'
            showUploadList
            action={'http://geek.itheima.net/v1_0/upload'}
            name='image'
            onChange={onChange}
            maxCount={imageType}
            fileList={imageList}
          >
            <div style={{ marginTop: 8 }}>
              <PlusOutlined />
            </div>
          </Upload>}
        </Form.Item>
        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          {/* 富文本编辑器 */}
          <ReactQuill
            className="publish-quill"
            theme="snow"
            placeholder="Please enter content"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4 }}>
          <Space>
            <Button size="large" type="primary" htmlType="submit">
              Publish
            </Button>
          </Space>
        </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish
