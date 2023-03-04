const langs = {
  Ping_Msg: "```ini\n[ API ] :: <ping>ms\n[ Latency ] :: <latency>ms\n```",
  Ping: "Latency",
  none: "None",
  support_server: "Join Support Server!",
  support:
    "Encountered a bug or want to offer a suggestion?\nClick the button below to join the support server and create a post!",
  Switch: "Switch",
  Refresh: "Refresh",
  page: "Page",
  live: "Live",
  /**
   * Music
   */
  music_NotinChannel: "You are not on the voice channel!",
  music_NotSameChannel: "You and I are not on the same voice channel!",
  music_ConnectErr: "Oh no! I can't connect to your voice channel!",
  music_NoRes: "No song found",
  music_choose: "Choose a song!",
  music_chooseFooter:
    "If not selected, the first song will be played automatically",
  music_selectMusic: "Please select a song",
  music_AddToQueue: "Added to the song list",
  music_StartPlay: "Start playing",
  music_SelNonRes: "No response received",
  music_RequestBy: "Requester",
  music_Duration: "Duration",
  music_NoMusic: "No music is currently playing!",
  music_stop: "Stopped music",
  music_resume: "The song has resumed",
  music_pause: "Song paused",
  music_shuffle: "The playlist has been shuffled",
  music_NonAfter:
    "This is the last song, there is currently no next song for me to play",
  music_NonPrevious:
    "This is the first song, there is currently no previous song for me to play",
  music_previous: "Start playing the previous song",
  music_skip: "Start playing the next song",
  music_NonVol: "The current volume is",
  music_VolErr: "Volume can only be adjusted between 0 and 200",
  music_vol: "The volume has been adjusted to",
  music_clear: "The playlist has been cleared",
  music_MoveErr: "I can't find this song",
  music_move: "Moved <z> to",
  music_Length: "Amount",
  music_queueNoSong:
    "There are currently no songs in the playlist, you can add songs and check again",
  music_RemoveErr:
    "The input song position is greater than the number of remaining songs",
  music_remove: "Removed song",
  music_queueDestroy: "Player has been stopped so I can't play the song",
  music_NoDJRole: "You do not have the <z> (DJ) role to perform this action",
  music_UPer: "You don't have permission to `MANAGE_ROLE` to set up DJ!",
  music_deleteDJ: "DJ has been reset",
  music_setDJ:
    "<z> has been set as the DJ role, people without this role can only execute `play` `queue` commands",
};

module.exports = langs;
