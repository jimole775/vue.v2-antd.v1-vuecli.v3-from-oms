cd f:

# 判断当前是否有oms-web文件夹
is_right_tar(){
  res=0
  cd oms-web
  if [ $? -eq 0 ];then
    cd ..
  else
    res=1
  fi
  return $res
}

# 强制删除 oms-web文件夹
clear_tar(){
  runas /user:administrator rm -rf oms-web
}

# 创建目录，并执行初始化操作
create_tar(){
  mkdir -p oms-web
  cd oms-web
  git init
}

main(){
  i=0
  has_done=0
  org_branch="builder"
  new_branch=`expr $org_branch-$1`
  create_tar
  git_address=("xxx" "xxxx")
  while [[ $has_done -eq 0 && $i -lt ${#git_address[@]} ]]
  do
    git remote add origin ${git_address[$i]}
    git pull origin $org_branch
    git checkout -b $new_branch
    git push origin $new_branch
    # pull无异常，就跳过
    if [ $? -eq 0 ];then
      has_done=1
    else
      # 否则, 先删除origin, 再进入下一个循环
      git remote rm origin
      let i++
    fi
  done
}
main
exit