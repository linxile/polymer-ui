<template>
	<el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
		<el-form ref="userRef" :model="form" :rules="rules" label-width="120px">
			<el-row>
				<el-col :span="12">
          <el-form-item prop="avatar" label="用户头像">
              <UploadComponent
                  v-model:file-list="avatarList"
                  no-file-list
                  only-image
                  :accept="['jpg', 'png', 'jpeg']"
                  :max-size="10"
                  :max-count="1"
                  @success="handleUploadSuccess"
                  @error="handleUploadError"
              />
          </el-form-item>
					<el-form-item prop="username" label="用户账号">
						<el-input v-model="form.username" placeholder="用户账号"></el-input>
					</el-form-item>
          <el-form-item prop="realName" label="用户姓名">
            <el-input v-model="form.realName" placeholder="用户姓名"></el-input>
          </el-form-item>
					<el-form-item prop="mobile" label="手机号码">
						<el-input v-model="form.mobile" placeholder="手机号码"></el-input>
					</el-form-item>
          <el-form-item prop="deptId" label="所属部门">
            <el-tree-select
                v-model="form.deptId"
                :data="deptList"
                value-key="id"
                check-strictly
                :render-after-expand="false"
                :props="{ label: 'name', children: 'children' }"
                style="width: 100%"
            />
          </el-form-item>
          <el-form-item prop="password" label="用户密码">
            <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
          </el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item prop="email" label="用户邮箱">
						<el-input v-model="form.email" placeholder="邮箱"></el-input>
					</el-form-item>
          <el-form-item prop="gender" label="用户性别">
            <fast-radio-group v-model="form.gender" dict-type="user_gender"></fast-radio-group>
          </el-form-item>
          <el-form-item prop="city" label="所在城市">
            <el-cascader v-model="form.city" :options="cityOptions" :props="cascaderProps" filterable clearable style="width: 100%" placeholder="请选择城市" @change="handleCityChange" />
          </el-form-item>
          <el-form-item prop="address" label="详细地址">
            <el-input v-model="form.address" placeholder="详细地址"></el-input>
          </el-form-item>
					<el-form-item prop="roleIdList" label="所属角色">
						<el-select v-model="form.roleIdList" multiple placeholder="所属角色" style="width: 100%">
							<el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
						</el-select>
					</el-form-item>
          <el-form-item prop="postIdList" label="所属岗位">
            <el-select v-model="form.postIdList" multiple placeholder="所属岗位" style="width: 100%">
              <el-option v-for="post in postList" :key="post.id" :label="post.postName" :value="post.id"></el-option>
            </el-select>
          </el-form-item>
					<el-form-item prop="status" label="用户状态">
						<fast-radio-group v-model="form.status" dict-type="user_status"></fast-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<el-button @click="cancel">取消</el-button>
			<el-button type="primary" @click="submitForm()">确定</el-button>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
	import { ElMessage } from 'element-plus/es'
	import { useDeptListApi } from '@/api/sys/dept'
	import { useUserApi, useUserSubmitApi } from '@/api/sys/user'
  import { usePostListApi} from '@/api/sys/post'
	import { useRoleListApi } from '@/api/sys/role'
	import { useCityListApi } from '@/api/sys/city'
  import type {AttachmentUploadResult} from '@/types/api/common'
  import UploadComponent from '@/components/upload/index.vue';
  import {SysUser} from "@/types/api/sys/user";
  import {SysPost} from "@/types/api/sys/post";

  const emit = defineEmits<{(e: 'success'): void }>()
  const userRef = ref()
  const dialogVisible = ref<boolean>(false)
  const title = ref<string>("")
  const isEdit = ref<boolean>(false)

  const uploadRef = ref<InstanceType<typeof UploadComponent>>();


	const postList = ref<SysPost[]>([])
	const roleList = ref<any[]>([])
	const deptList = ref([])
  // 城市选项数据
  const cityOptions = ref<any[]>([])
  // 级联选择器配置
  const cascaderProps = {
    value: 'areaCode',  // 使用城市编码作为值
    label: 'name',  // 使用城市名称作为显示
    children: 'children' // 子节点字段名
  }

	const form = ref<SysUser>({
		id: undefined,
		username: '',
    avatar: '',
		realName: '',
		deptId: undefined,
		deptName: '',
		password: '',
		gender: 0,
		email: '',
		mobile: '',
    address: '',
    city: [] as string[],
		roleIdList: [] as any[],
		postIdList: [] as any[],
		status: 1
	})

  const rules = {
    username: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    realName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    mobile: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
    deptId: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
  }

  /** 打开弹窗（新增） */
  function open() {
    reset()
    isEdit.value = false
    title.value = "添加岗位"
    dialogVisible.value = true
  }

  /** 打开弹窗（修改） */
  function openWithData(id: number) {
    reset()
    isEdit.value = true
    title.value = "修改岗位"
    useUserApi(id).then(response => {
      form.value = response.data!
      dialogVisible.value = true
    })
  }


  /** 关闭弹窗 */
  function cancel() {
    dialogVisible.value = false
  }

  /** 弹窗关闭后重置表单 */
  function handleClosed() {
    reset()
  }

  /** 对外暴露方法 */
  defineExpose({
    open,
    openWithData
  })

  /** 表单重置 */
  function reset() {
    form.value = {
      id: undefined,
      username: '',
      avatar: '',
      realName: '',
      deptId: undefined,
      deptName: '',
      password: '',
      gender: 0,
      email: '',
      mobile: '',
      address: '',
      city: [] as string[],
      roleIdList: [] as any[],
      postIdList: [] as any[],
      status: 1
    } as SysUser;

    if (userRef.value) {
      userRef.value.resetFields()
    }
  }

  /** 提交按钮 */
  function submitForm() {
    userRef.value.validate((valid: boolean) => {
      if (valid) {
        const msg = isEdit.value ? "修改成功" : "新增成功"
        useUserSubmitApi(form.value).then(() => {
          ElMessage.success(msg)
          dialogVisible.value = false
          emit('success')
        })
      }
    })
  }

  // 使用 computed 带有 getter 和 setter
  const avatarList = computed({
    get: () => {
      if (form.value.avatar) {
        return [{
          name: '头像.jpg',
          url: form.value.avatar,
          size: 20000,
          platform: 'MINIO'
        }]
      }
      return []
    },
    set: (newValue) => {
      // 当上传组件更新 file-list 时，更新 dataForm.avatar
      if (newValue && newValue.length > 0) {
        form.value.avatar = newValue[0].url
      } else {
        form.value.avatar = ''
      }
    }
  })

  /**
   * 上传成功回调
   * 直接使用 AttachmentUploadResult 保存附件记录
   */
  function handleUploadSuccess(result: AttachmentUploadResult) {
    form.value.avatar = result.url;
    // 需重置上传组件的 loading 状态
    uploadRef.value?.resetUploadStatus();
  }

  // ========== 上传错误回调 ==========
  function handleUploadError(error: Error) {
    ElMessage.error(error.message || '上传失败')
  }

	// 获取岗位列表
  function getPostList() {
		return usePostListApi().then(res => {
			postList.value = res.data || []
		})
	}

	// 获取角色列表
  function getRoleList() {
		return useRoleListApi().then(res => {
			roleList.value = res.data
		})
	}

	// 获取部门列表
  function getDeptList() {
		return useDeptListApi().then(res => {
			deptList.value = res.data
		})
	}

  // 获取城市列表
  function getCityList() {
    useCityListApi().then(res => {
      cityOptions.value = res.data
    }).catch(() => {
      cityOptions.value = []
    })
  }

  // 城市选择变化处理
  function handleCityChange(value: string[]) {
    // 此处value已经是字符串数组，直接赋值
    form.value.city = value
  }

  // 页面初始化
  onMounted(() => {
    getDeptList()
    getPostList()
    getRoleList()
    getCityList()
  })
</script>
