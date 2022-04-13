<template>
  <SLayout>
    <a-row :gutter="24" class="mt15">
      <a-col :span="24">
        <dl class="m-block">
          <dd style="min-height:693px;">
            <div class="forbidbox">
              <img src="../assets/401.svg">
              <div class="nofenge">您没有访问权限！</div>
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
  padding-top: 10px;
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
