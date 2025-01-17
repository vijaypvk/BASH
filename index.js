import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

// Create a backdated commit with a given Moment.js date
const markCommitWithDate = async (date) => {
  const formatted = date.format();

  const data = {
    date: formatted,
  };

  await jsonfile.writeFile(path, data);
  await git.add([path]);
  await git.commit(`Random commit ${formatted}`, undefined, {
    "--date": formatted,
  });
};

// Make random commits in a specific month/year
const randomCommitsInMonth = async (year, month, count = 10) => {
  const start = moment(`${year}-${month}-01`);
  const end = start.clone().endOf("month");
  const daysInMonth = end.date();

  for (let i = 0; i < count; i++) {
    const randomDay = random.int(1, daysInMonth);
    const randomHour = random.int(0, 23);
    const randomMinute = random.int(0, 59);
    const date = start.clone().date(randomDay).hour(randomHour).minute(randomMinute);

    console.log(`updated on: ${date.format("YYYY-MM-DD HH:mm")}`);
    await markCommitWithDate(date);
    await new Promise(res => setTimeout(res, 500)); // Delay to avoid git overload
  }

  // Push all commits at once at the end
  await git.push();
};

randomCommitsInMonth(2025, 1, 10);