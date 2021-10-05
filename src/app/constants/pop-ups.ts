export enum PopUpsType {
    WELCOME,
    GAME_OVER,
    LEVEL_COMPLETE
}
  
export interface PopUp {
    type: PopUpsType;
    title: string;
    copy: string;
    buttonText: string; 
}
  
export const PopUps: PopUp[] = [
    {
      type: PopUpsType.WELCOME,
      title: "Level ",
      copy: "Time for a stroll",
      buttonText: "Play"
    },
    {
      type: PopUpsType.GAME_OVER,
      title: "Game Over",
      copy: "Try another time...",
      buttonText: "Start again"
    },
    {
      type: PopUpsType.LEVEL_COMPLETE,
      title: "Level complete",
      copy: "Well done",
      buttonText: "Back to menu"
    },
];