export type LogEntry = {
  uid: string;
  createdAt: number;
  action: LogActions;
  iconCode?: number;
  value: string;
  viewedBy: string[]; // uid array
};

export type RenderedLogEntry = {
  createdAt: number;
  message: string;
  id: string;
  viewedCurrentUser: boolean
};

export enum LogActions {
  CreateFarm,
  ViewFarm,
  AddMember,
  DeleteMember,
  AddArea,
  ViewArea,
  DeleteArea,
  AddWeatherData,
  AddAreaLocation,
  AddTree,
  AddTreeReport,
  DeleteTreeReport,
  AddFertilization,
  DeleteFertilization,
  AddCropdust,
  DeleteCropdust,
}

export enum LogIconCodes {
  Delete,
  Add,
  View,
}

export const logDictionary: Record<number, string> = {
  [LogActions.CreateFarm]: 'がこの農場を登録した',
  [LogActions.ViewFarm]: 'がこの農場を閲覧した',
  [LogActions.ViewArea]: 'が区域を閲覧した：',
  [LogActions.AddMember]: 'がメンバーを追加した',
  [LogActions.DeleteMember]: 'がメンバーを削除した',
  [LogActions.AddArea]: 'が区域を追加した：',
  [LogActions.AddWeatherData]: 'が気象データを記録した',
  [LogActions.AddAreaLocation]: 'が区域の位置情報を記録した',
  [LogActions.AddTree]: 'が木を新たに登録した：',
  [LogActions.AddTreeReport]: 'が木の育成記録を作成した：',
  [LogActions.DeleteTreeReport]: 'が木の育成記録を削除した',
  [LogActions.AddFertilization]: 'が施肥記録を作成した',
  [LogActions.DeleteFertilization]: 'が施肥記録を削除した',
  [LogActions.AddCropdust]: 'がこの農場を登録した',
  [LogActions.DeleteCropdust]: 'がこの農場を登録した',
  [LogActions.DeleteArea]: 'が区域を削除した：'
};

export const viewLogActions = [LogActions.ViewFarm, LogActions.ViewArea]
