export const fetchHelper = async <T>(url: string): Promise<T> => {
  try {
    const data = await fetch(url);

    if (!data.ok) {
      throw new Error("idk but something went wrong probably with them");
    }

    const json = await data.json();

    return json;
  } catch (error) {
    throw new Error(`Oops, something went wrong! ${error}`);
  }
};
