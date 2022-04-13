<template>
  <SLayout>
    <a-row :gutter="24" class="mt15">
      <a-col :span="24">
        <dl class="m-block">
          <dd style="min-height:693px;">
            <div class="forbidbox">
              <img src="../assets/404.svg">
              <div class="nofenge">您要访问的页面不存在！</div>
            </div>
          </dd>
        </dl>
      </a-col>
    </a-row>
  </SLayout>
</template>
<style lang="less" scoped>
.nofenge {
  text-align: center;
  padding-top: 20px;
  font-weight: bold;
}
.nofenge img {
  text-align: center;
  width: 260px;
}
.forbidbox {
  text-align:center;
  padding-top: 50px;
}
.forbidbox img {
  width: 450px;
}
</style>
