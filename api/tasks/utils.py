def truncate(text: str, length: int = 50):
    """
    Truncate a string to a maximum length with ellipsis if it's too long
    """
    if len(text) > length:
        text = f"{text[:length - 3]}..."
    return text
