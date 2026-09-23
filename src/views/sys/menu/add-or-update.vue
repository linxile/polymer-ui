<template>
  <el-dialog v-model="dialogVisible" :title="title" :close-on-click-modal="false" draggable @closed="handleClosed">
    <el-form ref="menuRef" :model="form" :rules="rules" label-width="120px" @keyup.enter="submitForm()">
      <el-form-item prop="type" label="类型">
        <el-radio-group v-model="form.type" :disabled="isEdit" @change="menuTypeChange(form.pid)">
          <el-radio :value="0" label="菜单" />
          <el-radio :value="1" label="按钮" />
          <el-radio :value="2" label="接口" />
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="name" label="名称">
        <el-input v-model="form.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="pid" label="上级菜单">
        <el-tree-select
            v-model="form.pid"
            :data="menuList"
            value-key="id"
            check-strictly
            :render-after-expand="false"
            :props="{ label: 'name', children: 'children' }"
            style="width: 100%"
            clearable
        />
      </el-form-item>
      <el-form-item v-if="form.type === 0" prop="url" label="路由">
        <el-input v-model="form.url" placeholder="路由"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number v-model="form.sort" controls-position="right" :min="0" aria-label="排序"></el-input-number>
      </el-form-item>
      <el-form-item v-if="form.type === 0" prop="openStyle" label="打开方式">
        <el-radio-group v-model="form.openStyle">
          <el-radio :value="0" label="内部打开" />
          <el-radio :value="1" label="外部打开" />
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="authority" label="授权标识">
        <el-input v-model="form.authority" placeholder="多个用逗号分隔，如：sys:menu:save,sys:menu:update"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type === 0" prop="icon" label="图标" class="popover-list">
        <el-popover ref="iconListPopover" placement="top-start" trigger="click" width="40%" popper-class="mod__menu-icon-popover">
          <template #reference>
            <el-input v-model="form.icon" :readonly="true" placeholder="图标"> </el-input>
          </template>
          <div class="mod__menu-icon-inner">
            <div class="mod__menu-icon-list">
              <el-button v-for="(item, index) in iconList" :key="index" :class="{ 'is-active': form.icon === item }" @click="iconHandle(item)">
                <svg-icon size="30px" :icon="item"></svg-icon>
              </el-button>
            </div>
          </div>
        </el-popover>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getIconList } from '@/utils/tool'
import { ElMessage } from 'element-plus/es'
import { getMenuById, submitMenu, useMenuListApi } from '@/api/sys/menu'
import { SysMenu } from '@/types/api/sys/menu'

const emit = defineEmits<{ (e: 'success'): void }>()
const menuRef = ref()
const iconListPopover = ref()
const menuList = ref<SysMenu[]>([])
const iconList = ref<string[]>([])
const dialogVisible = ref<boolean>(false)
const title = ref<string>("")
const isEdit = ref<boolean>(false)

const form = ref<SysMenu>({
  id: undefined,
  type: 0,
  name: '',
  pid: undefined,
  parentName: '',
  url: '',
  authority: '',
  sort: 0,
  icon: '',
  openStyle: 0
})

const rules = {
  name: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  parentName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

/** 打开弹窗（新增） */
function open(row?: SysMenu) {
  reset()
  isEdit.value = false
  title.value = "添加菜单"
  dialogVisible.value = true
  getMenuList()

  // 从某行"新增"子菜单时，带入父级
  if (row) {
    form.value.pid = row.id
    form.value.parentName = row.name
  }
}

/** 打开弹窗（修改） */
function openWithData(id: number) {
  reset()
  isEdit.value = true
  title.value = "修改菜单"
  getMenuList()
  getMenuById(id).then(response => {
    form.value = response.data!
    dialogVisible.value = true
  })
}

/** 菜单类型改变 */
function menuTypeChange(pid?: number) {
  getMenuList()
  form.value.pid = pid
}

/** 获取菜单列表 */
function getMenuList() {
  useMenuListApi(form.value.type).then(response => {
    menuList.value = response.data || []
  })
}

/** 图标点击事件 */
function iconHandle(icon: string) {
  form.value.icon = icon
  iconListPopover.value.hide()
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
    type: 0,
    name: '',
    pid: undefined,
    parentName: '',
    url: '',
    authority: '',
    sort: 0,
    icon: '',
    openStyle: 0
  }

  if (menuRef.value) {
    menuRef.value.resetFields()
  }

  // icon列表
  iconList.value = getIconList()
}

/** 提交按钮 */
function submitForm() {
  menuRef.value.validate((valid: boolean) => {
    if (valid) {
      const msg = isEdit.value ? "修改成功" : "新增成功"
      submitMenu(form.value).then(() => {
        ElMessage.success(msg)
        dialogVisible.value = false
        emit('success')
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.mod__menu {
  ::v-deep(.el-popover.el-popper) {
    overflow-x: hidden;
  }

  .popover-list {
    ::v-deep(.el-input__inner) {
      cursor: pointer;
    }
    ::v-deep(.el-input__suffix) {
      cursor: pointer;
    }
  }

  &-icon-inner {
    width: 100%;
    max-height: 350px;
    overflow-x: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #dddddd;
      background-clip: padding-box;
      min-height: 28px;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #bbb;
    }
  }
  &-icon-list {
    width: 100% !important;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 18px 0 0 8px;
      height: 45px;
      width: 45px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
</style>
