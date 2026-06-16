import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import toast from "react-hot-toast";
export const getStoryData = createAsyncThunk("/story/getstory", async () => {
  try {
    console.log("Hello World");
    const response = await axiosClient.get("/story/getstory");
    console.log(response);
    return response.data.result.stories;
  } catch (error) {
    toast.error("Error Getting Story Data");
    return Promise.reject(error);
  }
});

export const likeAndUnlikeStory = createAsyncThunk(
  "story/like",
  async (body) => {
    try {
      const response = await axiosClient.post("/story/like", body);
      console.log(response);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(response.data.result.message);
      return Promise.reject(error);
    }
  }
);

const storySlice = createSlice({
  name: "story",
  initialState: {
    story: [],
    status: "idle",
  },
  reducers: {
    addedStory: (state, action) => {
      state.story.push(action.payload);
      console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStoryData.fulfilled, (state, action) => {
      state.story = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(getStoryData.pending, (state) => {
      state.status = "loading"; // Handle loading state
    });
    builder.addCase(getStoryData.rejected, (state) => {
      state.status = "failed"; // Handle failed state
    });
    builder.addCase(likeAndUnlikeStory.fulfilled, (state, action) => {
      const story = action.payload.story;
      console.log(story);
      const index = state.story.findIndex((item) => item._id === story._id);
      if (index != -1) {
        state.story[index] = story;
      }
    });
  },
});
export const { addedStory } = storySlice.actions;
export default storySlice.reducer;
