export const getArgValue = (shortKey: string, longKey: string) => {
    const allArgs = process.argv;
    const allKeys = [shortKey, longKey];
    if (!allArgs.some((arg) => allKeys.includes(arg))) {
      console.error(
        `Please provide ${shortKey} or ${longKey} as command line argument`
      );
      process.exit(1);
    }
    const index = allArgs.findIndex((arg) => allKeys.includes(arg));
    let value = "";
    for (let i = index + 1; i < allArgs.length; i++) {
      if (allArgs[i].startsWith("-")) break;
      value += `${allArgs[i]} `;
    }
    value = value.trim();
    console.log(`🏗️ Using ${longKey.split("--")[1]} as ${value}`);
    return value;
  };