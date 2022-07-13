
export default function apimap (viewData, buildData) {
  buildData = fixObjectAccessEdge(viewData, buildData)
  buildData = piackApiFromViewData(viewData, buildData)
  return buildData['apimap']
}

function clearEmptyApi (src, fields) {
  fields.forEach((field) => {
    if (src[field] && !src[field].url) {
      delete src[field]
    }
  })
}

function create () {
  return Object.create(null)
}

function fixObjectAccessEdge (viewData, buildData) {
  !buildData['apimap'] && (buildData['apimap'] = create())
  Object.keys(viewData).forEach((key) => {
    const module = viewData[key]
    if (['list', 'apply', 'approval'].includes(key)) {
      Object.keys(module).forEach((rank) => {
        !buildData['apimap'][rank] && (buildData['apimap'][rank] = create())
        !buildData['apimap'][rank]['list'] && (buildData['apimap'][rank]['list'] = create())
        !buildData['apimap'][rank]['list']['table'] && (buildData['apimap'][rank]['list']['table'] = create())
        !buildData['apimap'][rank]['list']['batch'] && (buildData['apimap'][rank]['list']['batch'] = create())
        !buildData['apimap'][rank]['apply'] && (buildData['apimap'][rank]['apply'] = create())
        !buildData['apimap'][rank]['approval'] && (buildData['apimap'][rank]['approval'] = create())
      })
    }
  })
  return buildData
}

function piackApiFromViewData (viewData, buildData) {
  Object.keys(viewData).forEach((key) => {
    const module = viewData[key]
    switch (key) {
      case 'list':
        Object.keys(module).forEach((rank) => {
          const value = module[rank] || {}
          const list = buildData['apimap'][rank]['list']
          const apply = buildData['apimap'][rank]['apply']

          if (value.summary && value.summary.dataApi) {
            list.table.dataApi = value.summary.dataApi
            list.table.dataDir = value.summary.dataApi.dataDir
            clearEmptyApi(list.table, ['dataApi'])
          }

          if (value.summary && value.summary.batch) {
            list.batch = value.summary.batch
            apply.submit = value.summary.applySubmitApi
            clearEmptyApi(apply, ['submit'])
            clearEmptyApi(list.batch, Object.keys(list.batch))
          }
        })
        break
      case 'approval':
        Object.keys(module).forEach((rank) => {
          const value = module[rank] || {}

          const apply = buildData['apimap'][rank]['apply']
          const approval = buildData['apimap'][rank]['approval']

          if (value.logInfo) {
            approval['businessType'] = value.logInfo.businessType
          }

          approval['submit'] = value.approvalSubmitApi
          apply['detail'] = approval['detail'] = value.detailApi

          clearEmptyApi(apply, ['detail'])
          clearEmptyApi(approval, ['detail', 'submit'])
        })
        break
    }
  })
  return buildData
}
